import { createNode } from "@9elt/miniframe";

import config from "../util/config";

import mainCSS from "../styles/main.css";
import popupCSS from "../styles/popup.css";

import header from "./components/header";
import shortcuts from "./components/shortcuts";
import practice from "./components/practice";
import footer from "./components/footer";

const root = createNode({
    tagName: "div",
    id: "popup-GUI",
    className: "main",
    children: [
        header,
        {
            tagName: "div",
            children: [shortcuts],
        },
        practice,
        footer,
    ]
});

config.sub(c => document.body.className = c.theme);

document.head.append(createNode({
    tagName: "style",
    innerHTML: mainCSS + popupCSS,
}));

document.body.append(root);
