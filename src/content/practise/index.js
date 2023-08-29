import { State, createNode } from "@9elt/miniframe";
import practiseCSS from "../../styles/practise.css";
import history from "../../util/history";


export default async function renderPractiseSheet() {
    await history.ok;

    const _ref = structuredClone(history.value);
    const _order_init = history.value.map(flatten);

    const order = State.from("");

    const available = order.as(str => _ref.sort(sortAs(str || _order_init)));

    const hidden = State.from("");

    const active = State.use({
        a: available,
        h: hidden
    }).as(({ a, h }) => !h ? a : a.filter(k => !h.includes(k.kanji)));

    const printRefText = State.from(true);

    const style = {
        tagName: "style",
        innerHTML: practiseCSS,
    };

    const body = () => ({
        tagName: "body",
        children: [
            { tagName: "br" },
            header(),
            controls(),
            { tagName: "br" },
            {
                tagName: "div",
                children: available.as(a => a.map(info)),
            },
        ],
    });

    const header = () => ({
        tagName: "header",
        children: [
            {
                tagName: "h2",
                children: ["Kanji Practise Sheet"]
            },
            {
                tagName: "p",
                children: ["Jisho On The Fly"]
            },
            { tagName: "br" },
            {
                tagName: "p",
                children: ["created: ", (new Date).toLocaleString("en", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })]
            },
            {
                tagName: "p",
                children: ["mean jlpt: N", active.as(jlptMean)],
            },
            { tagName: "br" },
            {
                tagName: "p",
                children: [
                    "kanji ",
                    active.as(a => `(${a.length}):`),
                    { tagName: "br" },
                    active.as(a => a.map(flatten).join(" ")),
                ]
            },
            { tagName: "br" },
            {
                tagName: "p",
                className: State.use({ p: printRefText, o: order })
                    .as(({ p, o }) => p && o ? "ref-text" : "ref-text hidden"),
                children: [
                    "reference text: ",
                    { tagName: "br" },
                    {
                        tagName: "div",
                        children: order.as(str => str.split("\n")
                            .map(p => p ? { tagName: "p", children: [p] } : { tagName: "br" }))
                    }
                ],
            },
            { tagName: "br" },
            { tagName: "hr" },
            { tagName: "br" },
        ]
    });

    const controls = () => ({
        tagName: "div",
        className: "controls",
        children: [
            { tagName: "br" },
            {
                tagName: "button",
                children: ["PRINT"],
                onclick: () => window.print(),
            },
            { tagName: "br" },
            { tagName: "br" },
            {
                tagName: "p",
                children: [
                    "available kanji ",
                    available.as(a => `(${a.length}):`),
                    { tagName: "br" },
                    {
                        tagName: "small",
                        children: [
                            "The kanji currently in your history",
                        ],
                    },
                    { tagName: "br" },
                    available.as(a => a.map(flatten).join(" ")),
                ],
            },
            { tagName: "br" },
            {
                tagName: "div",
                className: "flex",
                children: [{
                    tagName: "div",
                    style: { width: "100%" },
                    children: [
                        {
                            tagName: "p",
                            children: [
                                "removed kanji: ",
                                { tagName: "br" },
                                {
                                    tagName: "small",
                                    children: [
                                        "The kanji listed here won't be printed",
                                    ],
                                }
                            ]
                        },
                        { tagName: "br" },
                        {
                            tagName: "textarea",
                            placeholder: "Enter some kanji",
                            rows: 3,
                            children: [""],
                            oninput: ({ target }) => {
                                hidden.value = target?.value || "";
                            },
                        },
                        { tagName: "br" },
                        {
                            tagName: "p",
                            children: [
                                "reference text: ",
                                { tagName: "br" },
                                {
                                    tagName: "small",
                                    children: [
                                        "Some text containing the kanji in your history.",
                                        { tagName: "br" },
                                        "The kanji will be printed in the same order as they appear in the reference text."
                                    ],
                                }
                            ]
                        },
                        { tagName: "br" },
                        {
                            tagName: "textarea",
                            placeholder: "Enter some reference text",
                            rows: 8,
                            children: [""],
                            oninput: ({ target }) => {
                                order.value = target?.value || "";
                            },
                        },
                        {
                            tagName: "div",
                            children: [{
                                tagName: "input",
                                type: "checkbox",
                                checked: printRefText.value,
                                name: "include-reference",
                                onchange: ({ target }) => {
                                    printRefText.value = target.checked;
                                }
                            }, {
                                tagName: "label",
                                for: "include-reference",
                                children: [" print reference text"]
                            }],
                        }
                    ]
                }],
            },
            { tagName: "br" },
            { tagName: "br" },
            { tagName: "hr" },
        ]
    });

    const info = (kanji) => ({
        tagName: "div",
        className: hidden.as(h => h.includes(kanji.kanji)
            ? "hidden wrapper" : "wrapper"),
        children: [
            {
                tagName: "div",
                className: "strokes",
                children: [
                    dash({
                        tagName: "div",
                        className: "ref",
                        children: [
                            {
                                tagName: "p",
                                className: "jlpt",
                                children: ["JLPT ", { tagName: "b", children: [kanji.jlpt] }]
                            },
                            {
                                tagName: "h1",
                                children: [kanji.kanji],
                            },
                        ]
                    }),
                    ...kanji.strokes.map(stroke => dash(stroke))
                ],
            },
            {
                tagName: "div",
                className: "info",
                children: [
                    // { tagName: "br" },
                    {
                        tagName: "div",
                        className: "flex",
                        style: { width: "100%" },
                        children: [
                            list(kanji.readings.kun, "kun-readings"),
                            list(kanji.readings.on, "on-readings")
                        ]
                    },
                    // { tagName: "br" },
                    list(kanji.meanings, "meanings"),
                ]
            },
            { tagName: "br" },
            {
                tagName: "div",
                className: "practice",
                children: [
                    dash(), dash(), dash(),
                    dash(), dash(), dash(),
                    dash(), dash(), dash(),
                    dash(),
                ],
            }
        ]
    });

    const list = (readings, type) => ({
        tagName: "div",
        className: type.includes("-")
            ? type.replace(/^[^-]*-/, "")
            : type,
        children: [
            {
                tagName: "h4",
                children: [type.replace("-", " ") + ":"],
            },
            {
                tagName: "ul",
                children: readings.slice(0, 8).map(r => ({
                    tagName: "li",
                    children: [r]
                }))
            }
        ]
    });

    const dash = (child) => ({
        tagName: "div",
        className: (child?.className ?? "") + " dash",
        children: [child || ""]
    });

    function jlptMean(a) {
        let mean = 0;
        let count = 0;
        for (let i = 0; i < a.length; i++) {
            const jlpt = parseInt(a[i].jlpt.charAt(1));
            !isNaN(jlpt) && (count++) && (mean += jlpt);
        }
        return Math.round(mean / count) || "/A";
    }

    function sortAs(str) {
        return (a, b) => iOf(str, a.kanji) - iOf(str, b.kanji);
    }

    function iOf(str, char) {
        let i = str.indexOf(char);
        return i < 0 ? str.length : i;
    }

    function flatten(a) {
        return a.kanji
    }

    document.head.append(createNode(style));
    document.body.append(createNode(body()));
}
