import { State } from "@9elt/miniframe";
import { request } from "../../util"

import config from "../../util/config";
import history from "../../util/history";


const confirm = State.from(false);

const clearHistoryButton = {
    tagName: "div",
    children: confirm.as(v => v
        ? [
            {
                tagName: "u",
                children: ["confirm"],
                onclick: () => { clearHistory(); confirm.value = false; }
            },
            " - ",
            {
                tagName: "u",
                children: ["cancel"],
                onclick: () => { confirm.value = false; }
            }
        ]
        : [{
            tagName: "u",
            children: ["clear kanji history"],
            onclick: () => { confirm.value = true; }
        }]
    ),
};

async function clearHistory() {
    await request({ type: "CLEAR-HISTORY" }, "TAB");
    await history.sync();
}

const switchThemeButton = {
    tagName: "div",
    children: [{
        tagName: "u",
        className: "theme",
        children: [config.as(c => invTheme(c.theme)), " theme"],
        onclick: () => {
            config.set(c => ({ ...c, theme: invTheme(c.theme) }));
            config.save();
        },
    }]
};

function invTheme(theme) {
    return theme === "dark" ? "light" : "dark";
}

const footer = {
    tagName: "footer",
    children: [
        { tagName: "hr" },
        {
            tagName: "div",
            children: history.as(h => !h.length || h[0] == "WAITING"
                ? [
                    switchThemeButton
                ] : [
                    clearHistoryButton,
                    switchThemeButton,
                ]
            )
        }
    ]
};

export default footer;
