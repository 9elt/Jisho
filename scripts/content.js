var last_kanji;
const kanji_history = {};

start();

function start() {

    renderShadow();

    //  keydown event router
    window.addEventListener('keydown', (e) => { eventRouter(e) });
}

function eventRouter(e) {

    //  press "ctrl + y" to run kanji lookup
    //  press "ctrl + m" to run definition lookup
    if (!e.ctrlKey) return;

    if (e.code == 'KeyY') {e.preventDefault(); e.stopPropagation(); kanjiLookup();}
    if (e.code == 'KeyM') {e.preventDefault(); e.stopPropagation(); defLookup();}
}

function renderShadow() {

    const top = document.createElement('div');
    top.id = 'jisho-extension-shadow';

    document.body.append(top);

    const shadow = top.attachShadow({mode : 'open'});

    const container = document.createElement('div');
    container.id = 'jisho-extension-container';
    container.innerHTML = jisho_extension_template;

    shadow.appendChild(container);

    //  close button, click event
    shadow.querySelectorAll('.close-gui').forEach(close => {

        close.addEventListener('click', () => { guiState([]) });
    });
}

//  kanji lookup

async function kanjiLookup(history = null) {

    if (!history && !window.getSelection) return;

    //  get kanji from selection
    let sel;

    if (!history) {

        sel = userSelection(1);

        //  if selected kanji in history then load
        if (kanji_history[sel]) {

            //  if selection is the same close !!
            if (sel === last_kanji) { last_kanji = ''; return guiState([]); }

            last_kanji = sel;
            history = kanji_history[sel];
            guiState(['container', 'kanji-lookup']);
        }
    }

    //  scrape, or get, kanji
    const okanji = history ? history : await scrapeKanji(sel);
        if (okanji === 'error') return error();

    //  scrape svg if not loaded
    if (!history) okanji.svg = await scrapeStrokes(okanji.svg_url);
        if (okanji.svg === 'error') return error();

    //  render stroke order
    let strokes = renderStrokes(okanji.svg)

    //  RENDER

    const shadow = document.getElementById('jisho-extension-shadow').shadowRoot; // access shadow root

    // kanji meanings and readings
    shadow.querySelector('.kanji>h1').innerHTML = okanji.kanji;
    shadow.querySelector('.kanji>a').href = okanji.kanji_url;
    shadow.querySelector('.kanji>p').innerHTML = okanji.jlpt;

    let el_trans = shadow.querySelector('.readings-meanings>.translation');
    let el_kun = shadow.querySelector('.readings-meanings>.kun');
    let el_on = shadow.querySelector('.readings-meanings>.on');
    
    el_trans.innerHTML = '';
    el_kun.innerHTML = '<li class="title">Kun</li>';
    el_on.innerHTML = '<li class="title">On</li>';

    okanji.translations.forEach(trans => { appendLi(trans, el_trans) });
    okanji.kuns.forEach(kun => { appendLi(kun, el_kun) });
    okanji.ons.forEach(on => { appendLi(on, el_on) });

    //  stroke order
    const stroke_order = shadow.querySelector('.stroke-order');
    stroke_order.innerHTML = '';

    stroke_order.append(strokes);

    //  history
    let el_history = shadow.querySelector('.history');
    let this_history = document.createElement('li');

    if (!el_history.innerHTML.includes(okanji.kanji)) {

        this_history.innerHTML = okanji.kanji;
        el_history.prepend(this_history);
        //  save kanji to history
        kanji_history[okanji.kanji] = okanji;

        //  history click event listener
        this_history.addEventListener('click', function () {
            kanjiLookup(kanji_history[this.innerHTML]);
        });
    }

    if (el_history.children.length > 10) {

        //  remove from history
        delete kanji_history[el_history.children[10].innerHTML];
        el_history.children[10].remove();
    }

    //  open gui
    guiState(['container', 'kanji-lookup']);
}

async function scrapeKanji(kanji) {

    guiState(['container', 'loader']);

    const okanji = {};

    okanji.kanji = kanji;
    okanji.kanji_url = `https://jisho.org/search/${encodeURI(okanji.kanji)}%20%23kanji`;

    let kanji_page = await scrape(okanji.kanji_url);
    if (kanji_page === 'error') return 'error';

    try { okanji.svg_url = 'https:' + kanji_page.split("var url = '")[1].split("';")[0];
    } catch (err) { return 'error'; }

    kanji_page = washPage(kanji_page);
    if (kanji_page === 'error') return 'error';

    const scraped = document.createElement('div');
    scraped.innerHTML = kanji_page;

    okanji.translations = scraped.querySelector('.kanji-details__main-meanings');
    let readings = scraped.querySelectorAll('.kanji-details__main-readings-list');

    try { okanji.jlpt = scraped.querySelector('.kanji_stats>.jlpt>strong').innerHTML;
    } catch (err) { okanji.jlpt = 'N/A'; }

    try { okanji.translations = okanji.translations.textContent.trim().split(',');
    } catch (err) { okanji.translations = []; }

    try { okanji.kuns = readings[0].textContent.trim().split('、 ');
    } catch (err) { okanji.kuns = []; }

    try { okanji.ons = readings[1].textContent.trim().split('、 ');
    } catch (err) { okanji.ons = []; }

    last_kanji = okanji.kanji;

    scraped.remove();

    return okanji;
}

// stroke order

function renderStrokes(svg) {

    let container = document.createElement('div');

    const paths = svg.querySelectorAll('path');
    for (let i = 0; i < paths.length; i++) {

        let current = svg.cloneNode(true);
        let c_paths = current.querySelectorAll('path');

        for (let j = 0; j < c_paths.length; j++) {

            let c_path = c_paths[j]
            c_path.classList.add('active');
            if (c_path == c_paths[i]) { c_path.classList.add('current'); break; };
        }

        let c_path =  c_paths[i];

        let points = c_path.getAttribute('d').replaceAll('C','c');
        let pos = [
            points.split('M')[1].split(',')[0],
            points.split('M')[1].split(',')[1].split('c')[0]
        ]; 
        current.innerHTML += `<circle cx="${pos[0]}" cy="${pos[1]}" r="${5}" />`;

        container.append(current);
    }

    return container;
}

async function scrapeStrokes(url) {

    let str = await scrape(url);

    const container = document.createElement('div');
    container.innerHTML = str;

    let svg = container.querySelector('svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.children[1].remove(); // remove stroke numbers

    return svg;
}

//  definition lookup

async function defLookup() {

    if (!history && !window.getSelection) return;

    let selection = userSelection();

    const definitions = await scrapeDefs(selection, 10);
        if (definitions === 'error') return error();

    console.log(definitions);

    loadDefinition(definitions, 0);

    guiState(['container', 'definition-lookup']);
}

function loadDefinition(definitions, num) {

    const definition = definitions[num];
    const shadow = document.getElementById('jisho-extension-shadow').shadowRoot;

    //reset definition
    shadow.querySelector('.definition-lookup').innerHTML = definition_template;
    shadow.querySelector('.d-l .close-gui').addEventListener('click', () => { guiState([]) });

    shadow.querySelector('a').href = definition.link;

    definition.word.forEach(char => {
        let word = shadow.querySelector('.word>ul');
        if (char.furigana == '') char.furigana = '&nbsp';
        appendLi(`<span>${char.furigana}</span>${char.kanji}`, word);
    });

    for (let i = 0; i < definition.meanings.length; i++){

        let meaning = definition.meanings[i];
        let meanings = shadow.querySelector('.meanings');

        let tag = document.createElement('p');
        tag.className = 'tag';
        tag.innerHTML = meaning.tag;

        let meaning_ul = document.createElement('ul');
        meaning_ul.className = 'meaning';

        let index = appendLi(`${i + 1}`, meaning_ul);
        index.className = 'index';

        meaning.meaning.forEach(single_meaning => {
            appendLi(single_meaning.trim(), meaning_ul);
        });

        meanings.append(tag, meaning_ul);
    }

    def_btns = shadow.querySelector('.definitions');

    for (let i = 0; i < definitions.length; i++) {

        let li;

        if (definitions[i].exact_match) {
            li = appendLi(`exact match ${i + 1}`, def_btns);
        } else {
            li = appendLi(`definition ${i + 1}`, def_btns);
        }

        if (definitions[i] == definition) li.className = 'active';

        li.addEventListener('click', () => { loadDefinition(definitions, i) });

        def_btns.append(li);
    }
}

async function scrapeDefs(selection) {

    guiState(['container', 'loader']);

    let def_url = `https://jisho.org/search/${encodeURI(selection)}`;

    let def_page = await scrape(def_url);
    if (def_page === 'error') return 'error';

    def_page = washPage(def_page);
    if (def_page === 'error') return 'error';

    const scraped = document.createElement('div');
    scraped.innerHTML = def_page;

    const defs_wrappers = scraped.querySelectorAll('#primary .concept_light.clearfix');
    const definitions = [];

    for (let i = 0; i < defs_wrappers.length; i++) {

        const def = {};
        def.word = [];
        def.meanings = [];
        def.link = defs_wrappers[i].querySelector('.light-details_link').href;
  
        //  exact match found
        def.exact_match = defs_wrappers[i].parentElement.classList.contains('exact_block');

        //  populate word
        let words = defs_wrappers[i].querySelector('.text').textContent.trim();
        let furigana = defs_wrappers[i].querySelectorAll('.furigana>span');
        for (let i = 0; i < words.length; i++) {

            let furigana_txt = furigana[i] ? furigana[i].textContent : '';

            def.word.push({
                'kanji': words[i],
                'furigana': furigana_txt
            });
        }

        //  populate meanings
        const meaning_cont = defs_wrappers[i].querySelector('.meanings-wrapper');
        let tags = meaning_cont.querySelectorAll('.meaning-tags');
        let meanings = meaning_cont.querySelectorAll('.meaning-meaning');
        for (let i = 0; i < meanings.length; i++) {

            def.meanings.push({
                'tag': tags[i].textContent,
                'meaning': meanings[i].textContent.split(';')
            });
        }

        definitions.push(def);

        if (i == 2) break;
    }

    scraped.remove();

    return definitions;
}

//  utility

function scrape(url) {

    return new Promise((resolve, reject) => {

        chrome.runtime.sendMessage({'scrape': true, 'url': url}, (res) => {

            res ? resolve(res) : reject('error');
        });
    });
}

function washPage(page_str) {

    try {

        page_str = page_str.replaceAll('<use xlink:href=', '<p data-use=').replaceAll('></use>', '></p>');
        page_str = page_str.replaceAll('src=', 'data-src=');

        return page_str;

    } catch (err) { return 'error'; }
}

function userSelection(limit) {

    let selection = window.getSelection();
    selection = selection.baseNode.textContent.substring(selection.baseOffset, selection.extentOffset);
    if (limit) selection = selection.substring(0, limit);

    return selection;
}

function appendLi(inner_html, parent_element) {

    let li = document.createElement('li');
    li.innerHTML = inner_html;
    parent_element.append(li);

    return li;
}

//  gui state

const gui_sections = ['container', 'error', 'loader', 'kanji-lookup', 'definition-lookup'];

function error() {

    guiState(['container', 'error']);
    setTimeout(() => { guiState([]) }, 1200);
}

function guiState(active_sections) {

    const shadow = document.getElementById('jisho-extension-shadow').shadowRoot;

    gui_sections.forEach(section => {

        if (active_sections.includes(section)) {
            shadow.querySelector('.' + section).classList.add('active');
        } else {
            shadow.querySelector('.' + section).classList.remove('active');
        }
    });
}