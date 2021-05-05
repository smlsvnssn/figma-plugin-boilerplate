import './öQuery.min.js';
import { nyord } from './nyord.js';

export const 
    löremIpsum = (
        numberOfParagraphs = 1,
        sentencesPerParagraph = 10,
        maxSentenceLength = 10, {
            minSentenceLength = 1,
            isHeadline = false,
            isName = false,
            nyordFrequency = .1,
            neologismerFrequency = .05,
            namnFrequency = 0,
            useLörem = true,
            punchline = 'Du kan vara drabbad.',
            wrapInDiv = false,
            paragraphStartWrap = '<p>',
            paragraphEndWrap = '</p>',
            alwaysWrapParagraph = false
        } = {}
    ) => {
        let
            k = 'bdfghjklmnprstv',
            v = 'aouåeiyäö',
            pre = [
                'a', 'a', 'a', 'ana', 'ante', 'anti', 'astro', 'auto', 'be', 'be', 'be', 'be', 'bi', 'bio', 'de', 'deka', 'deci', 'di', 'di', 'di', 'dia', 'ego', 'epi', 'euro', 'e', 'exo', 'eu', 'geo', 'giga', 'hemi', 'hetero', 'hexa', 'homo', 'hypo', 'i', 'infra', 'intra', 'ko', 'kontra', 'kro', 'kvasi', 'makro', 'ma', 'mega', 'mikro', 'mono', 'multi', 'o', 'o', 'o', 'o', 'o', 'o', 'para', 'pa', 'pe', 'poly', 'po', 'pre', 'pre', 'pre', 'pro', 'pseudo', 're', 'rea', 're', 'semi', 'steno', 'su', 'supra', 'sy', 'tele', 'tera', 'tetra', 'tra', 'tri', 'ultra',
            ],
            mid = [
                'do', 're', 'mi', 'fa', 'so', 'la', 'ti', 'ne', 'de', 'se', 'kro', 'pla', 'pre', 'tre', 'di', 'va', 'sa', 'po', 'ka', 'spe', 'vi', 'ni', 'be', 'te', 'ny',
            ],
            suf = [
                'sa', 'na', 'ra', 'da', 'sat', 'nat', 'rat', 'dat', 'sade', 'nade', 'rade', 'dade', 't', 'ss', 's', 'ck', 'pp', 'n', 'n', 'n', 'n', 'n', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'd', 'ssa', 'tt', 'st', 'st', 'nt', 'ren', 'de', 'de', 'de', 'de', 'se', 'nera', 'ning', 'ning', 'sade', 'ssade', 'rade', 'rad', 'ktig', 'rtad', 'sm', 'ledes', 'skap', 'skapet', 'l', 'l', 'l', 'ns', 'ktig', 'ktigt', 'ktiga', 'll', 'ns', 'gon', 'gen', 'het', 'heten', 'bel', 'bel', 'belt', 'd', 'k', 'ng', 'ngen', 's', 's', 's', 'sk', 'sk', 'sk', 'ska', 'ska', 'skade', 'sm', 'v', 'v', 'v', 'ligen', 'logi', 'gisk', 'ment', 'sam', 'samma', 'vis', 'vis', 'vis', 'vis', 'gt', 'gt', 'gt', 'lig', 'lig', 'lig', 'liga', 'liga', 'ligt', 'ligt', 'ra', 'rar', 'rade', 'ras', 'rat', 'na', 'nar', 'nade', 'nas', 'nat', 'nde', 'nde', 'nde', 're', 're', 'ren', 'ling', 'lingar', 'ling', 'ng', 'ngar', 'ngen',
            ],
            konj = [
                'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'i', 'och', 'och', 'och', 'och', 'och', 'och', 'och', 'och', 'och', 'och', 'att', 'att', 'att', 'att', 'det', 'en', 'på', 'är', 'som', 'för', 'med', 'har', 'av', 'till', 'den', 'inte', 'inte', 'inte', 'inte', 'de', 'om', 'ett', 'jag', 'men',

                'samt', 'såväl som', 'respektive', 'plus', 'inklusive', 'eller', 'men', 'fast', 'utan', 'utom', 'förutom', 'för', 'så', 'det vill säga', 'alltså', 'att', 'som', 'om', 'än', 'om', 'ifall', 'huruvida', 'än', 'liksom', 'såsom', 'eftersom', 'därför att', 'för att', 'då', 'emedan', 'fast', 'fastän', 'oaktat', 'om än', 'även om', 'för att', 'om', 'ifall', 'då', 'när', 'medan', 'sedan', 'innan', 'till', 'tills'
            ],
            akademiska = {
                prefix: ['ab', 'agnosti', 'andro', 'ana', 'ambi', 'anti', 'antropo', 'apo', 'astro', 'bi', 'bio', 'cyn', 'de', 'des', 'demi', 'demo', 'dia', 'dys', 'eko', 'elektro', 'em', 'en', 'endo', 'epi', 'etno', 'filo', 'fono', 'foto', 'hetero', 'hyper', 'kom', 'kon', 'kontra', 'kvasi', 'logo', 'medel', 'mega', 'meta', 'metro', 'mikro', 'miso', 'mono', 'myto', 'neo', 'onto', 'opera', 'pan', 'para', 'per', 'pneuma', 'poli', 'poly', 'post', 'pre', 'prima', 'pro', 'pseudo', 'psyko', 'radio', 're', 'rea', 'semi', 'stereo', 'supra', 'syn', 'te', 'tele', 'tempo', 'tera', 'terra', 'teo', 'termo', 'trans', 'tri'],
                suffix: ['aktiv', 'bel', 'centrism', 'cism', 'ception', 'diktisk', 'faktisk', 'fas', 'fiering', 'fili', 'foni', 'form', 'gam', 'gen', 'graf', 'gram', 'gyn', 'ism', 'itet', 'kemi', 'krati', 'log', 'logi', 'mani', 'matisk', 'meter', 'modern', 'netik', 'nomi', 'osmos', 'patologi', 'plastisk', 'pod', 'pol', 'siv', 'sion', 'skop', 'social', 'sofi', 'stat', 'stik', 'tes', 'tet', 'tik', 'tion', 'tism', 'tiv', 'tologi', 'topi', 'tropi', 'tos', 'total', 'tris', 'typ', 'valens', 'vision']
            },
            namn = {
                k: ["Maria", "Anna", "Margareta", "Elisabeth", "Eva", "Kristina", "Birgitta", "Karin", "Marie", "Elisabet", "Ingrid", "Christina", "Sofia", "Linnéa", "Kerstin", "Lena", "Helena", "Marianne", "Emma", "Linnea", "Johanna", "Inger", "Sara", "Cecilia", "Elin", "Anita", "Louise", "Ida", "Linda", "Gunilla", "Ulla", "Susanne", "Hanna", "Viola", "Malin", "Katarina", "Jenny", "Carina", "Elsa", "Monica", "Astrid", "Irene", "Ulrika", "Alice", "Julia", "Annika", "Viktoria", "Barbro", "Åsa", "Amanda", "Matilda", "Therese", "Camilla", "Ann", "Siv", "Yvonne", "Lovisa", "Agneta", "Britt", "Caroline", "Lisa", "Ingegerd", "Charlotte", "Sandra", "Frida", "Sofie", "Anette", "Gun", "Emelie", "Margaretha", "Ebba", "Emilia", "Ellen", "Alexandra", "Berit", "Victoria", "Erika", "Charlotta", "Jessica", "Anneli", "Maja", "Inga", "Olivia", "Agnes", "Märta", "Pia", "Madeleine", "Ingeborg", "Mona", "Felicia", "Ella", "Gunnel", "Josefin", "Sonja", "Karolina", "Birgit", "Lina", "Magdalena", "Signe", "Helen"],

                m: ["Erik", "Lars", "Karl", "Anders", "Johan", "Per", "Nils", "Carl", "Mikael", "Jan", "Hans", "Peter", "Olof", "Lennart", "Gunnar", "Sven", "Fredrik", "Daniel", "Bengt", "Bo", "Alexander", "Gustav", "Göran", "Åke", "Magnus", "Martin", "Andreas", "Stefan", "John", "Mats", "Leif", "Ulf", "Thomas", "Björn", "Henrik", "Jonas", "Axel", "Christer", "Bertil", "Robert", "Arne", "David", "Emil", "Ingemar", "Håkan", "Kjell", "Stig", "Mattias", "Rolf", "William", "Oskar", "Tommy", "Roland", "Michael", "Patrik", "Simon", "Joakim", "Christian", "Oscar", "Marcus", "Sebastian", "Anton", "Roger", "Gustaf", "Ingvar", "Eric", "Tomas", "Olov", "Viktor", "Johannes", "Tobias", "Hugo", "Niklas", "Elias", "Kent", "Adam", "Ove", "Emanuel", "Robin", "Jörgen", "Filip", "Ali", "Rune", "Kenneth", "Gösta", "Wilhelm", "Linus", "Arvid", "Albin", "Jonathan", "Dan", "Sten", "Kurt", "Oliver", "Olle", "Rickard", "Alf", "Claes", "Vilhelm", "Henry"],

                e: ["Andersson", "Johansson", "Karlsson", "Nilsson", "Eriksson", "Larsson", "Olsson", "Persson", "Svensson", "Gustafsson", "Pettersson", "Jonsson", "Jansson", "Hansson", "Bengtsson", "Carlsson", "Jönsson", "Lindberg", "Petersson", "Magnusson", "Lindström", "Gustavsson", "Olofsson", "Lindgren", "Axelsson", "Bergström", "Lundberg", "Lundgren", "Berg", "Jakobsson", "Berglund", "Sandberg", "Fredriksson", "Mattsson", "Sjöberg", "Forsberg", "Henriksson", "Lindqvist", "Lind", "Engström", "Eklund", "Lundin", "Danielsson", "Ali", "Håkansson", "Holm", "Gunnarsson", "Bergman", "Samuelsson", "Fransson", "Nyström", "Lundqvist", "Björk", "Holmberg", "Wallin", "Johnsson", "Arvidsson", "Söderberg", "Nyberg", "Isaksson", "Nordström", "Mårtensson", "Lundström", "Björklund", "Eliasson", "Berggren", "Ahmed", "Sandström", "Nordin", "Ström", "Åberg", "Ekström", "Hermansson", "Holmgren", "Hedlund", "Sundberg", "Sjögren", "Dahlberg", "Mohamed", "Martinsson", "Öberg", "Hellström", "Strömberg", "Månsson", "Blom", "Ek", "Abrahamsson", "Falk", "Blomqvist", "Norberg", "Åkesson", "Lindholm", "Sundström", "Löfgren", "Åström", "Jonasson", "Dahl", "Söderström", "Jensen", "Andreasson"]
            },

            neologismer = (o => o.prefix.map(p => o.suffix.map(s => p + s)).flat())(akademiska),

            getName = () => `${ö.random() ? namn.k[ö.random(100)] : namn.m[ö.random(100)]} ${namn.e[ö.random(100)]}`,

            getWord = () => {
                return Math.random() < nyordFrequency ?
                    nyord[ö.random(nyord.length)] :
                    Math.random() < neologismerFrequency ?
                        neologismer[ö.random(neologismer.length)] :
                        Math.random() < namnFrequency ?
                            getName() :
                            pre[ö.random(pre.length)] +
                            (ö.random(5) ? '' : mid[ö.random(mid.length)]) +
                            (ö.random(10) ? '' : mid[ö.random(mid.length)]) +
                            (ö.random(15) ? '' : mid[ö.random(mid.length)]) +
                            suf[ö.random(suf.length)];
            },

            getSentence = () => {
                let max = ö.random(minSentenceLength, maxSentenceLength + 1),
                    s = '';
                // reduce probability of one word sentences (but not 0)
                max = max < 2 ? ö.random(minSentenceLength, maxSentenceLength + 1) : max;

                for (let n of ö.range(max)) {
                    s += getWord();

                    // add commas or colons
                    s += n > 0 && n < max - 1 && !ö.random(6) ? (ö.random(8) ? ', ' : ': ') : ' ';

                    // add conjunctions
                    if (n > 0 && n < max - 1) s += ö.random(3) ? '' : konj[ö.random(konj.length)] + ' ';
                }

                // Make it a sentence
                return s.slice(0, 1).toUpperCase() + s.slice(1, -1) + (isHeadline ? '' : '. ');
            },

            getParagraph = () => {
                let p = '';

                if (isName) p += getName();
                else {
                    for (let i of ö.range(sentencesPerParagraph))
                        p += getSentence();

                    // add punchline
                    if (maxSentenceLength > 3)
                        p += ö.random(15) ? '' : (isHeadline ? '. ' + punchline + '' : punchline + ' ');
                }

                // wrap if more than one paragraphs
                return wrapWithP ? paragraphStartWrap + p + paragraphEndWrap : p;
            },

            wrapWithP = numberOfParagraphs > 1 || alwaysWrapParagraph,
            lörem = 'Lörem ipsum ',
            // add random syllables for variation
            syllables = Array(50).fill().map(() => k[ö.random(k.length)] + v[ö.random(v.length)]),
            s = '';

        if (isName) useLörem = false;

        // add mid thrice so as not to sound too pompous.
        pre = [...pre, ...syllables, ...v.split(''), ...mid, ...mid, ...mid];
        mid = [...mid, ...syllables];

        // get pragraphs
        for (let i of ö.range(numberOfParagraphs))
            s += getParagraph();

        // add lörem
        if (useLörem && maxSentenceLength > 3)
            s = wrapWithP ?
                s.slice(0, paragraphStartWrap.length) + lörem +
                s.slice(paragraphStartWrap.length, paragraphStartWrap.length + 1).toLowerCase() +
                s.slice(paragraphStartWrap.length + 1)
                :
                lörem + s.slice(0, 1).toLowerCase() + s.slice(1);

        // optional wrap
        return wrapInDiv ? '<div>' + s + '</div>' : s;
    }
    