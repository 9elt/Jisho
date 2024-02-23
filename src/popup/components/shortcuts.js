import { State } from "@9elt/miniframe";
import config from "../../util/config";

const shortcuts = {
    tagName: "div",
    children: [
        {
            tagName: "h4",
            children: ["Settings"]
        },
        {
            tagName: "p",
            children: [
                "Use the shortcuts below to look up ",
                { tagName: "b", children: ["word definitions"] },
                " or ",
                { tagName: "b", children: ["kanji information"] },
                ", ",
                "directly on the page. ",
                "Click on the circle to record a new shortcut"
            ]
        },
        {
            tagName: "div",
            children: config.as(c => Object.keys(c.actions ?? {})
                .map(name => shortcut(name, c.actions[name]))),
        }
    ]
};

function shortcut(action, keys) {
    const active = new State(false);
    const display = active.as(v => v ? display.value = "Recording..." : formatKeys(keys));

    function record() {
        active.value = true;
        window.onkeydown = (e) => {
            e.preventDefault();
            if (e.code.includes("Key")) {
                window.onkeydown = null;
                active.value = false;
                config.set(curr => ({
                    ...curr, actions: {
                        ...curr.actions,
                        [action]: {
                            code: e.code,
                            ctrlKey: e.ctrlKey,
                            shiftKey: e.shiftKey,
                            altKey: e.altKey,
                        },
                    }
                }));
                config.save();
            }
        }
        window.onmousedown = () => {
            window.onkeydown = null;
            active.value = false;
        }
    }

    return {
        tagName: "div",
        className: active.as(a => a ? "shortcut active" : "shortcut"),
        children: [
            {
                tagName: "p",
                className: "caption",
                children: ["Look up a ", action.replace("on", "").toLowerCase()]
            },
            {
                tagName: "div",
                children: [
                    {
                        tagName: "p",
                        className: "keys",
                        children: display
                    },
                    {
                        tagName: "div",
                        className: "record",
                        onclick: () => record(),
                    }
                ],
            }
        ]
    };
}

function formatKeys(action) {
    const KS = [];
    if (action.ctrlKey) KS.push(name("ctrlKey"));
    if (action.shiftKey) KS.push(name("shiftKey"));
    if (action.altKey) KS.push(name("altKey"));
    if (action.code) KS.push(name(action.code));
    return KS.join(" + ").split(" ")
        .map(v => v !== "+" ? { tagName: "b", children: [v] } : " + ");
}

function name(code) {
    return code.replaceAll("Key", "").toUpperCase();
}

export default shortcuts;
