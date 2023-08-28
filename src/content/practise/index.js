import { State, createNode } from "@9elt/miniframe";
import practiseCSS from "../../styles/practise.css";
import history from "../../util/history";
import { isKanji } from "../../util";

export default async function renderPractiseSheet() {
    await history.ok;
    const active = hidden.as(h => history.value.filter(k => !h.includes(k.kanji)));

    document.head.append(createNode(style));
    document.body.append(createNode(body(active, history.value)));
}

const hidden = State.from([]);

const style = {
    tagName: "style",
    innerHTML: practiseCSS,
};

const body = (active, history) => ({
    tagName: "body",
    children: [
        { tagName: "br" },
        header(active),
        controls(history),
        { tagName: "br" },
        {
            tagName: "div",
            children: history.map(kanji => info(kanji)),
        },
    ],
});

const header = (active) => {
    const mean = active.as(a => {
        let mean = 0;
        let count = 0;
        for (let i = 0; i < a.length; i++) {
            const jlpt = parseInt(a[i].jlpt.charAt(1));
            if (isNaN(jlpt)) { continue; }
            count++;
            mean += jlpt;
        }
        return Math.round(mean / count) || "/A";
    });

    return {
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
                children: ["kanji: ", active.as(a => a.map(k => k.kanji).join(" ") + ` (${a.length})`)]
            },
            {
                tagName: "p",
                children: ["mean jlpt: N", mean],
            },
            {
                tagName: "p",
                children: ["created: ", (new Date).toLocaleString("en", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })]
            },
            { tagName: "br" },
        ]
    };
}

const controls = (history) => ({
    tagName: "div",
    className: "controls",
    children: [
        { tagName: "hr" },
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
            children: ["available kanji: ", history.map(k => k.kanji).join(" ")],
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
                        tagName: "textarea",
                        placeholder: "Enter here the kanji you don't want to print",
                        rows: 5,
                        children: [""],
                        oninput: (e) => {
                            hidden.value = e.target?.value?.split("").filter(isKanji) ?? [];
                        },
                    },
                ]
            }],
        },
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
                { tagName: "br" },
                {
                    tagName: "div",
                    className: "flex",
                    style: { width: "100%" },
                    children: [
                        list(kanji.readings.kun, "kun-readings"),
                        list(kanji.readings.on, "on-readings")
                    ]
                },
                { tagName: "br" },
                list(kanji.meanings, "meanings"),
            ]
        },
        { tagName: "br" },
        {
            tagName: "div",
            className: "practice",
            children: [dash(""), dash(""), dash(""), dash(""), dash(""), dash(""), dash(""), dash(""), dash(""), dash("")],
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
    className: (child.className ?? "") + " dash",
    children: [child || ""]
});
