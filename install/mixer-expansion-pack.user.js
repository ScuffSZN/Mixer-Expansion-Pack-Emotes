// ==UserScript==
// @name         Mixer Expansion Pack
// @namespace    http://scuffed.dev/Mixer-Expansion-Pack-Emotes
// @version      0.1
// @description  Emote packs for Mixer Expansion Pack.
// @author       ScuffedDev
// @match        https://mixer.com/*
// @grant        none
// ==/UserScript==

(function() {Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = this.length - 1; i >= 0; i--) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

var settings = {
    'emotes': true,
    'avatar': false,
    'colors': true
}

let emotes = new Map();

const colors = {
    'A': 'f44336',
    'B': 'e91e63',
    'C': '9c27b0',
    'D': '673ab7',
    'E': '536dfe',
    'F': '2196f3',
    'G': '03a9f4',
    'H': '00bcd4',
    'I': '009688',
    'J': '4caf50',
    'K': '8bc34a',
    'L': 'cddc39',
    'M': 'ffeb3b',
    'N': 'ffc107',
    'O': 'ff9800',
    'P': 'ff5722',
    'Q': 'f44336',
    'R': 'e91e63',
    'S': '9c27b0',
    'T': '673ab7',
    'U': '536dfe',
    'V': '2196f3',
    'W': '03a9f4',
    'X': '00bcd4',
    'Y': '009688',
    'Z': '4caf50',

    'a': '8bc34a',
    'b': 'cddc39',
    'c': 'ffeb3b',
    'd': 'ffc107',
    'e': 'ff9800',
    'f': 'ff5722',
    'g': 'f44336',
    'h': 'e91e63',
    'i': '9c27b0',
    'j': '673ab7',
    'k': '536dfe',
    'l': '2196f3',
    'm': '03a9f4',
    'n': '00bcd4',
    'o': '009688',
    'p': '4caf50',
    'q': '8bc34a',
    'r': 'cddc39',
    's': 'ffeb3b',
    't': 'ffc107',
    'u': 'ff9800',
    'v': 'ff5722',
    'w': 'f44336',
    'x': 'e91e63',
    'y': '9c27b0',
    'z': '673ab7',

    '0': '536dfe',
    '1': '2196f3',
    '2': '03a9f4',
    '3': '00bcd4',
    '4': '009688',
    '5': '4caf50',
    '6': '8bc34a',
    '7': 'cddc39',
    '8': 'ffeb3b',
    '9': 'ffc107',
    '-': 'ff9800',
    '_': 'ff5722',
}

let init_timer = setInterval(() => {
    if (document.querySelector('*[class^="scrollWrapper__"]')) {
        init();
        clearInterval(init_timer)
    }
}, 1000)

let init = () => {

    setupPicker();

    let css = '*[class^="message__"] { display: none; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);

    document.querySelector('*[class^="scrollWrapper__"]').addEventListener('DOMNodeInserted', (e) => {
        var messageClean = "";
        var messageRaw = "";
        if (e.target.classList !== undefined) {
            // console.log(e.target.classList !== undefined)
            // console.log(e.target.classList)

            if ((e.target.classList.value.includes('message__')) && (e.target.classList.value.includes('clickable__'))) {

                e.target.style.display = 'none';
                e.target.querySelectorAll('span:not(*[class^="message__"]):not(*[class^="Username__"])').forEach((el) => {
                    if (el.classList.length == 0) {
                        messageRaw += el.innerText;
                        messageClean += el.innerText;
                    }
                    if (el.classList.length > 0)
                        if (el.classList[0].includes("Emote"))
                            messageRaw += `<span class="Emote__1O22q emote__23Wl7" style='${el.getAttribute('style')}'></span>`

                    if (el.classList.length > 0)
                        if (el.classList[0].includes("Emote"))
                            messageClean += `:${el.getAttribute('aria-label')}`

                    el.remove();
                });

                messageHandeler({
                    "username": event.target.querySelector('*[class^="Username__"]').innerText,
                    "message_raw": messageRaw,
                    "message_clean": messageClean
                }, e.target)

            }
        }
    }, false);
}


let messageHandeler = (j, e) => {
    e.querySelector('*[class^="messageContent_"]').innerHTML += messageParser(j.message_raw);

    if (settings.colors)
        e.querySelector('*[class^="Username__"]').style.color = `#${colors[j.username.charAt(0)]}`;

    if (!settings.avatar && e.querySelector('*[class^="ChatAvatar__"]')) {
        e.querySelector('*[class^="ChatAvatar__"]').style.display = 'none';
        e.querySelector('*[class^="messageContent_"]').style.marginLeft = '8px';
    }

    e.style.display = 'block';
}

let messageParser = (m) => {
    var words = m.split(" ");
    var message = "";
    words.forEach((w) => {
        if (emotes.has(w.toLowerCase()) && settings.emotes)
            message += `<img src="${emotes.get(w.toLowerCase())}" style="vertical-align: middle;height: 24px;"> `
        else
            message += `${w} `
    })
    return message
}


let emoteManager = (p) => {
    var emote = p.emotes;
    for (var key in emote) {
        emotes.set((key.toLowerCase()), emote[key])
    }
    console.info(`[load pack]: ${p.packName}`)
}

let setupPicker = () => {

}

fetch('https://api.betterttv.net/emotes')
    .then((r) => {
        return r.json();
    })
    .then(function (j) {
        j.emotes.forEach((y) => {
            emotes.set(y.regex, y.url)
        })
    });

fetch('https://scuffed.dev/Mixer-Expansion-Pack-Emotes/emotes/twitchGlobal.json')
    .then((r) => {
        return r.json();
    })
    .then(function (j) {
        emoteManager(j)
    });


fetch('https://scuffed.dev/Mixer-Expansion-Pack-Emotes/emotes/ice-poseidon.json')
    .then((r) => {
        return r.json();
    })
    .then(function (j) {
        emoteManager(j)
    });

fetch('https://scuffed.dev/Mixer-Expansion-Pack-Emotes/emotes/ninja.json')
    .then((r) => {
        return r.json();
    })
    .then(function (j) {
        emoteManager(j)
    });
fetch('https://scuffed.dev/Mixer-Expansion-Pack-Emotes/emotes/testPack.json')
    .then((r) => {
        return r.json();
    })
    .then(function (j) {
        emoteManager(j)
    });

fetch('https://scuffed.dev/Mixer-Expansion-Pack-Emotes/emotes/peepo-pack.json')
    .then((r) => {
        return r.json();
    })
    .then(function (j) {
        emoteManager(j)
    });

fetch('https://scuffed.dev/Mixer-Expansion-Pack-Emotes/emotes/at-pack.json')
    .then((r) => {
        return r.json();
    })
    .then(function (j) {
        emoteManager(j);
    });
})();
