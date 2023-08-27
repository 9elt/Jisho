import { PRACTISE_SHEET_URL } from "../../util/consts";

import history from "../../util/history";

history.sync();

const practise = history.as(history => ({
    tagName: "div",
    children:
        !history.length ? [
            {
                tagName: "h4",
                children: ["Kanji Practise"]
            },
            {
                tagName: "p",
                children: [
                    "You don't have a kanji history, ",
                    { tagName: "b", children: ["lookup some kanji"] },
                    " to enable this feature!"
                ]
            },
        ] : history[0] === "WAITING" ? [] : [
            {
                tagName: "h4",
                children: ["Kanji Practise"]
            },
            {
                tagName: "p",
                children: [
                    "You have looked up ",
                    { tagName: "b", children: [history.length, " kanji"] },
                    " with Jisho on the fly. Now you can practice",
                    history.length > 1 ? " them!" : "!"
                ]
            },
            {
                tagName: "div",
                className: "practise",
                children: [
                    {
                        tagName: "div",
                        className: "preview",
                        children: [
                            dashed({
                                tagName: "h2",
                                children: [history[0].kanji],
                            }),
                            dashed(history[0].strokes[0] || ""),
                            dashed(history[0].strokes[1] || ""),
                            dashed(history[0].strokes[2] || ""),
                            dashed(history[0].strokes[3] || ""),
                            dashed(history[0].strokes[4] || ""),
                        ]
                    },
                    {
                        tagName: "p",
                        className: "download",
                        children: [
                            "Generate  ",
                            { tagName: "b", children: ["PRACTISE SHEET"] },
                        ],
                        onclick: () => {
                            window.open(PRACTISE_SHEET_URL, '_blank').focus();
                        }
                    }
                ]
            }
        ]
}));

function dashed(child) {
    return {
        tagName: "div",
        className: "dashed",
        children: child.tagName === "h2" ? [child] : [
            child,
            { tagName: "div" },
            { tagName: "div" },
            { tagName: "div" },
            { tagName: "div" },
        ],
    }
}

export default practise;
