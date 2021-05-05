const
    throttle = (f, t = 50, debounce = false, immediately = false) => {
        let timeout, lastRan, running = false;
        return function () {
            const context = this, args = arguments;
            if (!lastRan || (debounce && !running)) { // first run or debounce rerun
                if (!debounce || immediately) f.apply(context, args);
                lastRan = Date.now();
            } else {
                clearTimeout(timeout);
                timeout = setTimeout(
                    () => {
                        if (Date.now() - lastRan >= t) {
                            f.apply(context, args);
                            lastRan = Date.now();
                            running = false;
                        }
                    },
                    debounce ? t : t - (Date.now() - lastRan)
                );
            }
            running = true;
        };
    },
    randomNormal = (mean = 0, sigma = 1) => {
        const samples = 6;
        let sum = 0, i = 0;
        for (i; i < samples; i++) sum += Math.random();
        return (sigma * 8.35 * (sum - samples / 2)) / samples + mean;
    },
    clamp = (n, min, max) => Math.min(Math.max(n, min), max),
    round = (n, precision = 0) => Math.round(n * 10 ** precision + Number.EPSILON) / 10 ** precision,

    randomise = () => {
        const
            h = (randomNormal(0, +q('#h').value) + 3600) % 360,
            s = clamp(randomNormal(70, +q('#s').value), 0, 100),
            l = clamp(randomNormal(60, +q('#l').value), 0, 100),
            a = clamp(randomNormal(1, +q('#a').value/100), 0, 1);

        return `hsla(${round(h, 5)}, ${round(s, 5)}%, ${round(l, 5)}%, ${round(a, 5)})`;
    },

    q = document.querySelector.bind(document),

    qa = document.querySelectorAll.bind(document),

    checkForm = e => {
        // set target value to both slider fields
        if (e.target.classList.contains('slider'))
            qa('#' + e.target.id).forEach( el => el.value = e.target.value );
        else
            // ugly last minute brute force to update on savedState
            qa('input[type=range]').forEach(el => el.nextSibling.nextSibling.value = el.value );

        qa('c').forEach(el => el.style.setProperty('color', randomise()))
        q('#update').style.setProperty('background-color', randomise());

        return {
            hsla: {
                h: +q('#h').value,
                s: q('#s').value / 100,
                l: q('#l').value / 100,
                a: q('#a').value / 100
            },
            settings: {
                includeFills: q('#fills').checked,
                includeStrokes: q('#strokes').checked,
                includeGradients: q('#gradients').checked,
            }
        }
    },
    
    post = e => {
        parent.postMessage( { pluginMessage: checkForm(e) }, '*' )
    };

let isFirstRun = true; 

onmessage = e => {
    const s = e.data.pluginMessage;
    q('#h').value = s.hsla.h;       
    q('#s').value = s.hsla.s * 100;
    q('#l').value = s.hsla.l * 100;
    q('#a').value = s.hsla.a * 100;

    q('#fills').checked = s.settings.includeFills;
    q('#strokes').checked = s.settings.includeStrokes;
    q('#gradients').checked = s.settings.includeGradients;

    isFirstRun = false;
    q('form').dispatchEvent(new InputEvent('input'));
};

q('form').addEventListener('input', throttle(post, 200));
q('#update').addEventListener('click', post);

setTimeout(() => isFirstRun && q('form').dispatchEvent(new InputEvent('input')), 500) // run on load if first run