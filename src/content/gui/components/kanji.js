const kanji = (kanji, { onClose, history, onHistory }) => ({
    tagName: "div",
    className: "kanji",
    children: [
        {
            tagName: "div",
            className: "info",
            children: [
                heading(kanji),
                readings_meanings(kanji),
            ],
        },
        {
            tagName: "div",
            className: "strokes",
            children: kanji.strokes,
        },
        {
            tagName: "div",
            className: "bottom-bar",
            children: [
                {
                    tagName: "ul",
                    className: "history",
                    children: history.map(kanji => ({
                        tagName: "li",
                        children: [kanji],
                        onclick: () => onHistory(kanji),
                    })),
                },
                {
                    tagName: "p",
                    className: "close",
                    children: ["close"],
                    onclick: onClose,
                }
            ],
        }
    ]
});

const heading = ({ link, kanji, jlpt, grade }) => ({
    tagName: "div",
    className: "heading",
    children: [
        {
            tagName: "a",
            href: link,
            target: "_blank",
            children: ["jisho.org"],
        },
        {
            tagName: "h2",
            children: [kanji],
        },
        {
            tagName: "p",
            className: "jlpt",
            children: [jlpt],
        },
        {
            tagName: "p",
            className: "grade",
            children: ["grade ", grade],
        },
    ]
});

const readings_meanings = ({ meanings, readings }) => ({
    tagName: "div",
    className: "readings-meanings",
    children: [
        {
            tagName: "ul",
            className: "meanings",
            children: meanings.map(meaning => ({
                tagName: "li",
                children: [meaning],
            })),
        },
        {
            tagName: "ul",
            className: "readings kun",
            children: [
                {
                    tagName: "li",
                    className: "title",
                    children: ["Kun"],
                }
            ].concat(readings.kun.map(reading => ({
                tagName: "li",
                children: [reading],
            }))),
        },
        {
            tagName: "ul",
            className: "readings on",
            children: [
                {
                    tagName: "li",
                    className: "title",
                    children: ["On"],
                }
            ].concat(readings.on.map(reading => ({
                tagName: "li",
                children: [reading],
            }))),
        },
    ],
});

export default kanji;
