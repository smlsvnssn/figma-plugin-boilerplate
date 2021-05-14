const
	ö = {
		random: (min = undefined, max = undefined, float = false) => {
			float = typeof max === 'boolean' ? max : float; // max can be omitted
			[min, max] = max === undefined || typeof max === 'boolean'
				? (min === undefined ? [0, 2] : [0, +min]) // with no parameters, defaults to 0 or 1
				: [+min, +max];
			return float ? Math.random() * (max - min) + min : Math.floor(Math.random() * (max - min)) + min;
		},
		randomNormal: (mean = 0, sigma = 1) => {
			const samples = 6;
			let sum = 0, i = 0;
			for (i; i < samples; i++) sum += Math.random();
			return (sigma * 8.35 * (sum - samples / 2)) / samples + mean;
			// ^ hand made spread constant :-) 
		},
		clamp: (n, min, max) => Math.min(Math.max(n, min), max),
		round: (n, precision = 0) => Math.round(n * 10 ** precision + Number.EPSILON) / 10 ** precision,
	},

	clone = val => {
		const type = typeof val;
		if (val === null) return null;
		if (type === 'undefined' || type === 'number' ||
			type === 'string' || type === 'boolean') return val;
		if (type === 'object') {
			if (val instanceof Array) return val.map(x => clone(x));
			if (val instanceof Uint8Array) return new Uint8Array(val);
		}	
		const o = {};
		for (const key in val) {
			o[key] = clone(val[key])
		}
		return o;
	},

	toHsla = ({ r = 0, g = 0, b = 0, a = 1 } = {}) => {	
		const
			cmin = Math.min(r, g, b),
			cmax = Math.max(r, g, b),
			delta = cmax - cmin,
			h = ((
				delta === 0 ? 	0 :
				cmax === r ? 	((g - b) / delta) % 6 :
				cmax === g ? 	(b - r) / delta + 2 :
			  /*cmax  === b*/	(r - g) / delta + 4
			) * 60 + 360) % 360, // prevent negatives
			l = (cmax + cmin) / 2,
			s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

		return { h: h, s: s, l: l, a: a };
	},

	toRgba = ({ h = 0, s = 0, l = 0, a = 1 } = {}) => {
		const 
			c = (1 - Math.abs(2 * l - 1)) * s,
			x = c * (1 - Math.abs((h / 60) % 2 - 1)),
			m = l - c / 2,
			[r, g, b] = 
				0   <= h && h < 60 	? [c, x, 0] :
				60  <= h && h < 120 ? [x, c, 0] : 
				120 <= h && h < 180	? [0, c, x] :
				180 <= h && h < 240	? [0, x, c] :
				240 <= h && h < 300	? [x, 0, c] :
				300 <= h && h < 360	? [c, 0, x] : [0, 0, 0];
		return { 
			r: ö.round(r + m, 5), 
			g: ö.round(g + m, 5), 
			b: ö.round(b + m, 5), 
			a: ö.round(a, 5)
		 };
	
	},

	randomise = (rgba, msg) => {
		let {h,s,l,a} = toHsla(rgba);
		h = (ö.randomNormal(h, msg.hsla.h) + 36000) % 360; // to prevent extreme outliers causing negative number
		s = ö.clamp(ö.randomNormal(s, msg.hsla.s), 0, 1);
		l = ö.clamp(ö.randomNormal(l, msg.hsla.l), 0, 1);
		a = ö.clamp(ö.randomNormal(a, msg.hsla.a), 0, 1);
		return toRgba({ h:h, s:s, l:l, a:a })
	},

	randomisePaint = (paint, msg) => {
		if (paint.type === 'IMAGE') 
			return paint; // do nothing

		paint = clone(paint);
		if (paint.type === 'SOLID') {
			const { r, g, b, a } = randomise({
				r: paint.color.r,
				g: paint.color.g,
				b: paint.color.b,
				a: paint.opacity
			}, msg);
			paint.color = { r: r, g: g, b: b };
			paint.opacity = a;
			return paint;
		}
		if (paint.type.includes('GRADIENT') && msg.settings.includeGradients) {
			paint.gradientStops = paint.gradientStops.map(colorStop => {
				colorStop.color = randomise(colorStop.color, msg);
				return colorStop;
			})
			return paint;
		}
		return paint; // fallback
	},

	defaultFont = { family: "Roboto", style: "Regular" },

	getFontNames = node => {
		const getAllFontNames = node => {
			const seen = new Set(), fonts = [];
			for (const i of Array.from(node.characters).keys()) {
				const
					font = node.getRangeFontName(i, i + 1),
					name = font.family + font.style; // concatenate property values into string

				// if unseen, add the string to a set and output the object
				seen.has(name) || ( seen.add(name), fonts.push(font) );
			}
			return fonts;
		}
		return node.hasMissingFont ? ( figma.notify('Has missing font, replacing with Roboto Regular'), [defaultFont] )
			: node.fontName === figma.mixed ? getAllFontNames(node)
				: [node.fontName];
	},

	getSavedState = async () => await figma.clientStorage.getAsync('savedState'),

	rememberedNodes = new Map(),

	render = async msg => {
		figma.currentPage.selection.map(async node => {
			if (!('fills' in node) && !('strokes' in node)) return node;

			// Cache and read initial values
			if ( rememberedNodes.has(node.id) ) {
				node.fills = rememberedNodes.get(node.id).fills;
				node.strokes = rememberedNodes.get(node.id).strokes;
			} else {
				rememberedNodes.set(node.id, { fills: node.fills, strokes: node.strokes })
			}
			
			// randomise fills & strokes
			node.fills = msg.settings.includeFills ? 
				clone(node.fills).map(paint => randomisePaint(paint, msg)) : node.fills;

			node.strokes = msg.settings.includeStrokes ? 
				clone(node.strokes).map(paint => randomisePaint(paint, msg)) : node.strokes;

			// handle font loading
			if ('characters' in node) { // is text
				for (const fontName of getFontNames(node))
					await figma.loadFontAsync(fontName); // no promise management since this is reasonably fast and list is short
				if (node.hasMissingFont) node.fontName = defaultFont;
			}
			
			return node;
		})

		// check if selection has fillable nodes
		figma.currentPage.selection.filter(node => 'fills' in node || 'strokes' in node).length 
			|| figma.notify('Whoopsie-daisy! You need to select one or more objects with fills or strokes. Groups don\'t work.')
		
		// Save last settings. Don't wait for promise
		figma.clientStorage.setAsync('savedState', msg); 
	},

	init = async () => {
		const savedState = await getSavedState(); // Get last settings.
		figma.showUI(__html__, { width: 300, height: 478 });
		savedState && figma.ui.postMessage(savedState);

		figma.ui.onmessage = render;
	};

init();