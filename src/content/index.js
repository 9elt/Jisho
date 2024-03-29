import useControls from "./controls";
import jisho from "./client";
import gui from "./gui";
import config from "../util/config";
import history from "../util/history";
import cache from "../util/cache";
import renderPracticeSheet from "./practice";
import { cycleKanji, listen } from "../util";
import { PRACTICE_SHEET_URL } from "../util/consts";


listen("SYNC-CONFIG", config.sync);
listen("SAVE-HISTORY", history.save);
listen("CLEAR-HISTORY", history.clear);

if (window.location.href === PRACTICE_SHEET_URL) {
    renderPracticeSheet();
}

window.onbeforeunload = () => { history.save() };

async function main() {
    await history.ok;
    await cache.ok;

    let trail = "";

    useControls({
        onKanji: ({ selection }) => {
            if (!selection) { return; }
            trail = cycleKanji(selection, trail);
            const target = trail.charAt(trail.length - 1);
            target ? getKanji(target)
                : gui.error(`No kanji found in "${selection}"`, 1000);
        },
        onDefinition: ({ selection }) => {
            selection && getDefinitions(selection);
        }
    });

    async function getKanji(kanji) {
        gui.current({ loader: true });
        gui.active(true);
        try {
            let data = cache.kanji[kanji];
            if (!data) {
                data = await jisho.kanji(kanji);
                cache.kanji[kanji] = data;
            }
            gui.current({ kanji: data }, {
                onClose: () => gui.active(false),
                onHistory: (k) => getKanji(k),
                history: history.value.slice(0, 12).map(h => h.kanji),
            });
            history.add(data);
        }
        catch {
            gui.error(`"Kanji "${kanji}" not found`);
        }
    }

    async function getDefinitions(phrase) {
        gui.current({ loader: true });
        gui.active(true);
        try {
            let data = cache.definitions[phrase];
            if (!data) {
                data = await jisho.definitions(phrase);
                cache.definitions[phrase] = data;
            }
            gui.current({ definitions: data }, {
                onClose: () => gui.active(false),
            });
        }
        catch {
            gui.error(`No definition found for "${phrase}"`);
        }
    }

    console.log("Jisho on the fly up and running");
};

main();
