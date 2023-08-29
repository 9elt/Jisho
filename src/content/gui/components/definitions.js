import { State } from "@9elt/miniframe";

const definitions = (definitions, { onClose }) => {
    const current = State.from(0);
    const definition = current.as(curr => definitions[curr]);

    return {
        tagName: "div",
        className: "definition",
        children: [
            {
                tagName: "div",
                className: "info",
                children: [
                    definition.as(def => word(def)),
                    definition.as(def => meanings(def)),
                ],
            },
            {
                tagName: "div",
                className: "bottom-bar",
                children: [
                    {
                        tagName: "ul",
                        children: definitions.map((def, i) => ({
                            tagName: "li",
                            className: current.as(c => c === i ? "active" : ""),
                            children: [
                                def.exact ? "exact match" : "similar",
                                {
                                    tagName: "span",
                                    children: [`(${i + 1})`],
                                }
                            ],
                            onclick: () => current.value = i,
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
    }
};

const word = ({ link, word }) => ({
    tagName: "div",
    className: "word",
    children: [
        {
            tagName: "a",
            href: link,
            target: "_blank",
            children: ["jisho.org"],
        },
        {
            tagName: "p",
            children: word.map(({ kanji, furigana }) => ({
                tagName: "ruby",
                children: [
                    {
                        tagName: "rt",
                        children: [furigana || ""],
                    },
                    kanji
                ],
            })),
        },
    ]
});

const meanings = ({ meanings }) => ({
    tagName: "div",
    className: "meanings",
    children: meanings.map(({ tag, meaning }) => ({
        tagName: "div",
        className: "meanings-container",
        children: [
            {
                tagName: "p",
                className: "tag",
                children: [tag],
            },
            {
                tagName: "ul",
                className: "meaning",
                children: meaning.map(meaning => ({
                    tagName: "li",
                    children: [meaning],
                })),
            }
        ],
    })),
});

export default definitions;
