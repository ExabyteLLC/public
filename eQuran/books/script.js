
/*
loc:
page []
aya ()
sora {}
gosk ||

tagweed:
mad 6 fard dark red mm
mad 2,4,6 gouaz red nn
mad 4,5 fard orange red aa
mad 2 fard orange hh
ekhfaa 2 green ff
edghaam mutted dd
tafkheem dark blue tt
kalkala blue kk
*/
const tajweed = {
    m: "mad-6-fard",
    n: "mad-246-gaouaz",
    a: "mad-45-fard",
    h: "mad-2-fard",
    f: "ekhfaa",
    d: "edghaam",
    t: "tafkheem",
    k: "kalkala",
}
const textarea = document.getElementById("textarea");
const iframe = document.getElementById("iframe");
const iframedoc = iframe.contentDocument || iframe.contentWindow.document;

// iframe setup
(function () {
    iframedoc.documentElement.lang = "ar";
    iframedoc.documentElement.dir = "rtl";

    for (let el of document.querySelectorAll("head [copy]")) {
        iframedoc.head.append(el.cloneNode(true));
    }
})();
// text area
(function () {
    textarea.onchange = textarea.onkeyup = function () {
        try {
            console.clear();
            var text = textarea.value;
            localStorage.setItem("textarea", text);
            var json = parseTextArea(text);
            var html = bookToHtml(json);
            appendToIframe(html);
            console.log(json);
        } catch (err) {
            console.error(err);
            appendToIframe(err);
        }
    }

    textarea.value = localStorage.getItem("textarea") ?? `[1](1)|1|{1} الله`;

    textarea.onchange();
})();


function parseTextArea(text) {
    var loc = {
        p: null, // []
        l: null, // \n
        a: null, // ()
        s: null, // {}
        g: null, // ||
    }
    var lines = text.split("\n");
    var arr = [];
    for (var l in lines) {
        var line = lines[l];
        loc.l = parseInt(l) + 1;
        var words = line.split(" ");
        for (var w in words) {
            var word = words[w];
            word = parseLoc(word);
            word.trim();
            if (!loc.p || !loc.a || !loc.s || !loc.g) {
                throw new Error(`Missing Data p:${loc.p}, a:${loc.a}, s:${loc.s}, g:${loc.g}!`);
            } else if (word) {
                addWord(parseWord(word));
            }
        }
    }
    return arr;

    function addWord(letters) {
        arr.push({
            page: loc.p, // []
            line: loc.l, // \n
            aya: loc.a, // ()
            soura: loc.s, // {}
            gosk: loc.g, // ||
            word: letters
        })
    }
    function parseLoc(word) {
        // page []
        const pageReg = getRegexNum("[", "]");
        if (word.search(pageReg) > -1) {
            loc.p = parseInt(word.match(pageReg)[0].replace("[", "").replace("]", ""));
            word = word.replace(pageReg, "");
        }
        // aya ()
        const ayaReg = getRegexNum("(", ")");
        if (word.search(ayaReg) > -1) {
            let na = parseInt(word.match(ayaReg)[0].replace("(", "").replace(")", ""));
            word = word.replace(ayaReg, "");
            if (na != loc.a && loc.a) {
                addWord([{ k: "aya", w: loc.a }]);
            }
            loc.a = na;
        }
        // soura {}
        const souraReg = getRegexNum("{", "}");
        if (word.search(souraReg) > -1) {
            loc.s = parseInt(word.match(souraReg)[0].replace("{", "").replace("}", ""));
            word = word.replace(souraReg, "");
        }
        // gosk ||
        const goskReg = getRegexNum("|", "|");
        if (word.search(goskReg) > -1) {
            loc.g = parseInt(word.match(goskReg)[0].replace("|", "").replace("|", ""));
            word = word.replace(goskReg, "");
        }
        return word;
    }
    function parseWord(word) {
        let letters = [];
        for (let key in tajweed) {
            const reg = getRegex(key);
            if (word.search(reg) > -1) {
                for (const match of word.matchAll(reg)) {
                    letters.push({
                        s: match.index,
                        e: match.index + match[0].length,
                        k: tajweed[key],
                        w: match[0].replaceAll(key, "")
                    });
                }
            }
        }
        let nword = [];
        if (letters.length == 0) {
            nword.push(word);
        } else {
            let norm = "";
            var letts = word.split("");
            for (var w = 0; w < letts.length; w++) {
                for (var l of letters) {
                    if (w >= l.s && w < l.e) {
                        if (norm) {
                            nword.push(norm);
                            norm = "";
                        }
                        nword.push({
                            k: l.k,
                            w: l.w,
                        });
                        w = l.e;
                    }
                }
                norm += letts[w];
                if (w == letts.length - 1) {
                    nword.push(norm);
                    norm = "";
                }
            }
        }
        return nword;
    }
}
function bookToHtml(arr) {
    var html = "<p>";
    var cur = {
        p: null, // []
        l: null, // \n
        a: null, // ()
        s: null, // {}
        g: null, // ||
    }
    for (let i in arr) {
        let w = arr[i];
        // add new line
        if (cur.l != w.line) {
            html += "</p><p>"
            cur.l = w.line;
        }
        // separate page
        if (cur.p != w.page) {
            html += `<span class="qp">p: ${w.page}</span>`
            cur.p = w.page;
        }
        // separate gosk
        if (cur.g != w.gosk) {
            html += `<span class="qg">g: ${w.gosk}</span>`
            cur.g = w.gosk;
        }
        // separate soura
        if (cur.s != w.soura) {
            html += `<span class="qs">s: ${w.soura}</span>`
            cur.s = w.soura;
        }
        // // separate aya
        // if (cur.a != w.aya) {
        //     if (cur.a) html += `<span class="qa">${cur.a}</span>`
        //     cur.a = w.aya;
        // }
        for (let l of w.word) {
            html += `<span class="q-${l?.k}">${l?.w || l}</span>`
        }
        html += " ";
    }
    html += "</p>";
    return html;
}
function appendToIframe(html) {
    iframedoc.body.innerHTML = html;
}
function getRegexNum(st, et) {
    return new RegExp(`\\${st}[(0-9)+]\\${et}`, "i");
}
function getRegex(t) {
    return new RegExp(`${t}([^a-zA-Z0-9]+)${t}`, "ig");
}