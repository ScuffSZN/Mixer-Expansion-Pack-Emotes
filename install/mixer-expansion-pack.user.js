// ==UserScript==
// @name         Mixer Expansion Pack
// @namespace    http://scuffed.dev/Mixer-Expansion-Pack-Emotes
// @version      1.8
// @description  Emote packs for Mixer Expansion Pack.
// @author       ScuffedDev
// @match        https://mixer.com/*
// @grant        none
// ==/UserScript==

(function () {
    let config = {
        "exPacks": {
            "TwitchtvGlobalEmotes": {
                "packName": "Twitch.tv Global Emotes",
                "channel": "all",
                "emotes": "https://scuffed.dev/Mixer-Expansion-Pack-Emotes/emotes/twitchGlobal.json",
                "enabled": true,
                "error": false
            },
            "IcePoseidonChannelEmotes": {
                "packName": "Ice Poseidon Channel Emotes",
                "channel": "ice-poseidon",
                "emotes": "https://scuffed.dev/Mixer-Expansion-Pack-Emotes/emotes/ice-poseidon.json",
                "enabled": true,
                "error": false
            }

        }
    }

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

    let css = `
@include url('https://fonts.googleapis.com/icon?family=Material+Icons+Round');
*[class^="message__"], div[class^="wrapper__"] div[class^="container_"]{ display: none; }
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
                background-color: #323d4b;
            }
            .emoteQuickSelectNameActive {
                background-color: #323d4b;
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
            .material-icons-round {
                color: #fff;
                padding: 5px 0px;
                cursor: pointer;
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


    var materialLink = document.createElement("link");
    materialLink.type = "text/css";
    materialLink.rel = "stylesheet";
    materialLink.href = 'https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Sharp|Material+Icons+Round|Material+Icons+Two+Tone';

    head.appendChild(materialLink);

    //https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Sharp|Material+Icons+Round|Material+Icons+Two+Tone

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

    var quickSelect = document.createElement('div');
    quickSelect.classList.add('emoteQuickSelect');

    let messageEvent = document.createEvent('Event');
    messageEvent.initEvent('message', true, true);

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
    emoteSelector.append(emoteSelectorList)

    /**** SETUP ****/
    var currentLocation = location.href,
        locationChangeListener = setInterval(() => {
            if (currentLocation != location.href)
                init();
            currentLocation = location.href;
        }, 500)

    var init = () => {
        console.info('[MEP] Initiated');
        var init_timer = setInterval(() => {
            if (document.querySelector('*[class^="scrollWrapper__"]')) {
                setUp();
                setupPicker();
                setupEmoteSelector();
                document.querySelector('.chat-container').append(quickSelect)
                clearInterval(init_timer)
            }
        }, 1000)
    }

    var setUp = () => {
        console.info('[MEP] Setup Message Handeler')
        document.querySelector('*[class^="scrollWrapper__"]').addEventListener('DOMNodeInserted', (e) => {
            if (e.target.classList !== undefined) {
                if ((e.target.classList.value.includes('message__')) && (e.target.classList.value.includes('clickable__'))) {
                    e.target.dispatchEvent(messageEvent);
                }
            }
        });

    }
    init();

    /**** MESSAGE HANDELER ****/
    window.addEventListener('message', function (e) {
        var messageClean = "";
        var messageRaw = "";

        e.target.querySelectorAll('span:not(*[class^="message__"]):not(*[class^="Username__"]):not(*[class^="badge_"])').forEach((el) => {
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
    }, false);

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



    /**** Quick Select ****/
    let setupPicker = () => {
        console.info('[MEP] Setup Quick Picker')
        document.querySelector('textarea').onkeydown = (event) => {

            if (event.key == 'Tab') {
                event.preventDefault();
                var wordStart = document.querySelector('textarea').value.substring(0, document.querySelector('textarea').selectionStart).lastIndexOf(" ") + 1,
                wordEnd = document.querySelector('textarea').selectionStart + 1;
                document.querySelector('textarea').value = `${document.querySelector('textarea').value.replaceBetween(wordStart, wordEnd, quickSelect.querySelectorAll('*')[0].innerText)} `;
                wordEnd = document.querySelector('textarea').selectionStart + 1;
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
                    quickSelect.style.bottom = `${document.querySelector('div[class^="webComposerBlock__"]').offsetHeight}px`;
                }
                quickSelect.append(selectEmote);
                quickSelect.style.bottom = `${document.querySelector('div[class^="webComposerBlock__"]').offsetHeight}px`;
            });
        }
    }


    /**** EMOTE SELECTOR ****/

    var setupEmoteSelector = () => {
        console.info('[MEP] Setting Up Emote Selector');
        document.querySelector('[aria-label="Emotes menu"]').style.display = 'none'
        emoteSelector.style.display = 'none';
        emoteSelectorBackdrop.style.display = 'none';
        document.querySelector('.chat-container').append(emoteSelector);
        document.querySelector('.chat-container').append(emoteSelectorBackdrop);

        var toggle = document.createElement('i')
        toggle.classList.add('material-icons-round')
        toggle.innerHTML = 'emoji_emotions';
        document.querySelector('[aria-owns="chat-listbox"]').append(toggle)

        toggle.onclick = (e) => {
            if (emoteSelector.style.display == 'none') {
                emoteSelector.style.display = 'block';
                emoteSelectorBackdrop.style.display = 'block';
            } else {
                emoteSelector.style.display = 'none';
                emoteSelectorBackdrop.style.display = 'none';
            }
        }
    }

    var emoteRenderer = () => {
        // console.log(packs)


        emoteSelectorList.innerHTML = '';
        var packList = Object.keys(packs);
        packList.sort(function (a, b) {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
        packList.forEach((p, j) => {
            // console.log(p, j)
            // console.log(packs[p].packName)

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

            var selectorSection = document.createElement('div');
            selectorSection.classList.add('emoteSection');

            var title = document.createElement('div');
            title.innerText = packs[p].packName;
            selectorSection.append(title);
            // console.log(selectorSection)
            selectorSection.append(emoteSection);
            // console.log(selectorSection)
            emoteSelectorList.append(selectorSection);
        })
    }


    /**** EMOTES LOADER ****/

    let emoteManager = (p) => {
        var emote = p.emotes;
        var emoteKeys = Object.keys(emote);

        emoteKeys.forEach((e, i) => {
            emotes.set((e.toLowerCase()), emote[e])
        })

        p.enabled = true;
        packs[(p.packName).replace(/[^a-zA-Z1-9]/g, '')] = p;
        //updateEmoteSelector(packs)
        emoteRenderer(packs);



        console.info(`[MEP] Added ${p.packName}`)
    }

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
