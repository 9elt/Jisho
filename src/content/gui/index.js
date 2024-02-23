import { createNode, State } from "@9elt/miniframe";

import config from "../../util/config";

import mainCSS from "../../styles/main.css";
import contentCSS from "../../styles/content.css";

import loader from "./components/loader";
import kanji from "./components/kanji";
import definitions from "./components/definitions";
import error from "./components/error";


const active = new State(false);
const current = new State(loader);

const style = {
    tagName: "style",
    innerHTML: mainCSS + contentCSS,
}

const container = {
    tagName: "div",
    id: "jisho-GUI",
    className: State.use({ c: config, a: active }).as(({ c, a }) =>
        c.theme + (a ? " active main" : " main")
    ),
    children: [current],
};

function render() {
    const element = createNode({
        tagName: "div",
        id: "jisho-ROOT",
        style: { position: "absolute" },
    });
    element.attachShadow({ mode: 'open' });
    element.shadowRoot.append(createNode(style));
    element.shadowRoot.append(createNode(container));
    document.body.append(element);
}

class GUI {
    isError;
    constructor() {
        this.isError = false;
    };
    active(v) {
        this.__check();
        active.value = v;
    }
    get isActive() {
        return active.value;
    }
    current(v, props) {
        this.__check();
        this.isError &&= false;
        current.value = this.__route(v, props);
    }
    __check() {
        if (!document.getElementById("jisho-ROOT"))
            render();
    }
    __route(r, props) {
        if (r.kanji)
            return kanji(r.kanji, props);
        if (r.definitions)
            return definitions(r.definitions, props);
        if (r.error) {
            this.isError = true;
            return error(r.error);
        }
        if (r.loader)
            return loader;
    }
    error(message, ms) {
        this.isActive || this.active(true);
        this.current({ error: message });
        setTimeout(() => this.isError && this.active(false), ms ?? 2_000);
    }
}

const gui = new GUI();
export default gui;
