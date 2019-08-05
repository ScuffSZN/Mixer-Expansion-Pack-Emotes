// ==UserScript==
// @name         Mixer Expansion Pack
// @namespace    http://scuffed.dev/Mixer-Expansion-Pack-Emotes
// @version      0.5
// @description  Emote packs for Mixer Expansion Pack.
// @author       ScuffedDev
// @match        https://mixer.com/*
// @grant        none
// ==/UserScript==

(function () {
    console.info('[MEP] Starting')
    
    Element.prototype.remove = function () {
        this.parentElement.removeChild(this);
    }
    NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
        for (var i = this.length - 1; i >= 0; i--) {
            if (this[i] && this[i].parentElement) {
                this[i].parentElement.removeChild(this[i]);
            }
        }
    }
    
    String.prototype.replaceBetween = function (start, end, what) {
        return this.substring(0, start) + what + this.substring(end);
    };
    
    String.prototype.splice = function (idx, rem, str) {
        return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };
    
    
    var settings = {
        'emotes': true,
        'avatar': false,
        'colors': true
    }
    
    let emotes = new Map();
    let packs = {}
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
    
    let quickSelect = document.createElement('div');
    
    let emoteSelector = document.createElement('div');
    emoteSelector.classList.add('emoteSelector');
    
    let emoteSelectorBackdrop = document.createElement('div');
    emoteSelectorBackdrop.classList.add('emoteSelectorBackdrop');
    emoteSelectorBackdrop.onclick = (e) => {
        emoteSelector.style.display = 'none'
        emoteSelectorBackdrop.style.display = 'none';
    }
    
    var closeSelector = document.createElement('div');
    closeSelector.classList.add('closeSelector');
    closeSelector.onclick = (e) => {
        emoteSelector.style.display = 'none'
        emoteSelectorBackdrop.style.display = 'none';
    }
    emoteSelector.append(closeSelector)
    
    var emoteSelectorList = document.createElement('div');
    emoteSelectorList.classList.add('emoteSelectorList');
    emoteSelector.append(emoteSelectorList);
    
    
    let init_timer = setInterval(() => {
        if (document.querySelector('*[class^="scrollWrapper__"]')) {
            init();
            clearInterval(init_timer)
        }
    }, 1000)
    
    let init = () => {
    
        console.info('[MEP] Initiated')
        setupPicker();
        setupEmoteSelector();
        let css = `*[class^="message__"], div[class^="wrapper__"] div[class^="container_"],*[class^="backdrop_"]{ display: none; } 
            .emoteQuickSelect {
                position: absolute;
                bottom: 49px;
                left: 0px;
                width: 100%;
                overflow-y: hidden;
                overflow-x: scroll;
                white-space: nowrap;
            }
            ::-webkit-scrollbar{
                height:5px;
            }
            .emoteQuickSelectName {
                display: inline-block;
                background-color: #171e2a;
                padding: 2px 4px;
                margin: 3px;
                border-radius: 4px;
                font-size: 14px;
                cursor:pointer;
            }
            .emoteQuickSelectName:hover {
                background-color: #171e29;
            }
            .emoteQuickSelectNameActive {
                background-color: #171e29;
            }
            .emoteSelectorBackdrop {
                position: absolute;
                top:0px;
                bottom: 0px;
                left: 0px;
                right: 0px;
                background-color: rgba(0,0,0,.1);
                z-index:50;
            }
            .emoteSelector {
                position: absolute;
                bottom: 55px;
                left: 10px;
                right: 10px;
                overflow-x: hidden;
                height: 50%;
                /*background-color: rgba(0, 0, 0, 0.75);*/
                background-color:#171e29;
                border-radius: 6px;
                overflow-y:hidden;
                color:#9fa4ae;
                font-family: "Industrywf",sans-serif;
                z-index:51;
            }
            .emoteSelectorList {
                height: 100%;
                overflow-y: scroll;
            }
            .emoteSection {
                padding: 12px;
            }
            .emoteSection img {
                height: 30px;
                padding: 4px;
                cursor: pointer;
            }
            .emoteSection img:hover {
                background-color: #323d4b;
                border-radius: 4px;
            }
            .closeSelector {
                font-family: MixerIcons;
                position: absolute;
                top: 5px;
                right: 5px;
                padding: 5px;
                cursor: pointer;
            }
            .closeSelector:hover {
                background-color: #323d4b;
                border-radius: 4px;
            }
            .closeSelector:before {
                content: "\\E409";
            }
            `,
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
    
        quickSelect.classList.add('emoteQuickSelect')
        document.querySelector('.chat-container').append(quickSelect)
    
        console.info('[MEP] Setup Message Handeler')
        document.querySelector('*[class^="scrollWrapper__"]').addEventListener('DOMNodeInserted', (e) => {
            var messageClean = "";
            var messageRaw = "";
            if (e.target.classList !== undefined) {
    
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
    
    
    let setupEmoteSelector = () => {
        console.info('[MEP] Setting Up Emote Selector')
        emoteSelector.style.display = 'none';
        emoteSelectorBackdrop.style.display = 'none';
        document.querySelector('.chat-container').append(emoteSelector);
        document.querySelector('.chat-container').append(emoteSelectorBackdrop)
    
        var toggle = document.querySelector('[aria-label="Emotes menu"]');
        toggle.onclick = (e) => {
            e.preventDefault();
            if (emoteSelector.style.display == 'none') {
                emoteSelector.style.display = 'block';
                emoteSelectorBackdrop.style.display = 'block';
            } else {
                emoteSelector.style.display = 'none';
                emoteSelectorBackdrop.style.display = 'none';
            }
        }
    }
    
    
    let updateEmoteSelector = (pack) => {
        emoteSelectorList.innerHTML = '';
        var packList = Object.keys(pack);
        packList.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        packList.forEach((p, j) => {
            var section = document.createElement('div');
            section.classList.add('emoteSection');
    
            var title = document.createElement('div');
            title.innerText = packs[p].packName;
            section.append(title);
    
            var emoteSection = document.createElement('div')
    
            var emote = packs[p].emotes;
            var emoteKeys = Object.keys(emote);
            emoteKeys.sort(function (a, b) {
                return a.toLowerCase().localeCompare(b.toLowerCase());
            });
            emoteKeys.forEach((e, i) => {
                emoteImg = document.createElement('img')
                emoteImg.src = emote[e];
                emoteImg.classList = e;
                emoteImg.onclick = () => {
                    //document.querySelector('textarea').selectionStart
                    document.querySelector('textarea').value = document.querySelector('textarea').value.splice(document.querySelector('textarea').selectionStart, 0, `${e} `);
                }
                emoteSection.append(emoteImg);
            })
            section.append(emoteSection)
            emoteSelectorList.append(section);
        })
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
                message += `<img src="${emotes.get(w.toLowerCase())}" alt="${w}" style="vertical-align: middle;height: 24px;"> `
            else
                message += `${w} `
        })
        return message
    }
    
    let setupPicker = () => {
        console.info('[MEP] Setup Quick Picker')
        document.querySelector('textarea').onkeydown = (event) => {
    
            if (event.key == 'Tab') {
                console.log('Tab')
                event.preventDefault();
            }
            keyHandel(event)
        }
        document.querySelector('textarea').onkeyup = (event) => {
            keyHandel(event)
        }
    }
    
    var search = (e) => {
        return [...emotes.keys()].filter(function (el) {
            return el.includes(e)
        })
    }
    var keyHandel = (event) => {
    
        var wordStart = document.querySelector('textarea').value.substring(0, document.querySelector('textarea').selectionStart).lastIndexOf(" ") + 1,
            wordEnd = document.querySelector('textarea').selectionStart + 1;
    
        var word = document.querySelector('textarea').value.substring(wordStart, wordEnd);
        if (event.key == 'enter' || document.querySelector('textarea').value === "") {
            quickSelect.innerHTML = '';
        } else {
            quickSelect.innerHTML = '';
            search(word.toLowerCase()).forEach((e, i) => {
                if (i > 5)
                    return true
    
                var selectEmote = document.createElement('div');
                selectEmote.classList.add('emoteQuickSelectName');
                if (i == 0)
                    selectEmote.classList.add('emoteQuickSelectNameActive');
                selectEmote.innerText = e;
                selectEmote.onclick = function () {
                    document.querySelector('textarea').value = `${document.querySelector('textarea').value.replaceBetween(wordStart, wordEnd, e)} `;
                    wordEnd = document.querySelector('textarea').selectionStart + 1;
                }
                quickSelect.append(selectEmote)
            });
        }
    }
    
    let emoteManager = (p) => {
        var emote = p.emotes;
        var emoteKeys = Object.keys(emote);
    
        emoteKeys.forEach((e, i) => {
            emotes.set((e.toLowerCase()), emote[e])
        })
    
        p.enabled = true;
        packs[(p.packName).replace(/[^a-zA-Z1-9]/g, '')] = p;
        updateEmoteSelector(packs)
    
        console.info(`[MEP] Added ${p.packName}`)
    }
    
    fetch('https://api.betterttv.net/emotes')
        .then((r) => {
            return r.json();
        })
        .then(function (j) {
            j.emotes.forEach((y) => {
                emotes.set((y.regex).toLowerCase(), y.url)
            })
        });
    
    
    var userPacks = ['https://scuffed.dev/Mixer-Expansion-Pack-Emotes/emotes/twitchGlobal.json', 'https://scuffed.dev/Mixer-Expansion-Pack-Emotes/emotes/ice-poseidon.json', 'https://scuffed.dev/Mixer-Expansion-Pack-Emotes/emotes/ninja.json', 'https://scuffed.dev/Mixer-Expansion-Pack-Emotes/emotes/testPack.json', 'https://scuffed.dev/Mixer-Expansion-Pack-Emotes/emotes/at-pack.json']
    
    
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
