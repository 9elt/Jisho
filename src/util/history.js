import { State } from "@9elt/miniframe";
import { request } from "./interop";
import { sizeKB } from "./util";
import storage from "./storage";

/**
 * @type {State<{
 *    link: string;
 *    kanji: string;
 *    meanings: string[];
 *    readings: {
 *        kun: string[];
 *        on: string[];
 *    };
 *    strokes: {
 *        tagName: string;
 *        viewBox: string;
 *        children: {
 *            tagName: string;
 *            d: string;
 *        }[];
 *    }[];
 *    jlpt: string;
 * }[]> & {
 *    ok: Promise<boolean>;
*     isAwaiting: boolean;
*     save: () => Promise<boolean>;
*     sync: () => Promise<boolean>;
*     clear: () => Promise<boolean>;
*     add: () => void;
* }} 
 */
const history = State.from(["WAITING"]);

history.ok = (async () => {
    history.value = await storage.get("history") ?? [];
    if (history.value.length) {
        console.log(`kanji history restored (${sizeKB(history.value)} KB)`);
    }
    return true;
})();

history.clear = async () => {
    if (!(await history.ok)) { return false };
    history.value = [];
    await history.save();
    return true;
}

history.sync = async () => {
    if (!(await history.ok)) { return false };
    await request({ type: "SAVE-HISTORY" }, "TAB");
    history.value = await storage.get("history") ?? [];
    return true;
}

history.save = async () => {
    if (!(await history.ok)) { return false };
    let size = 320;
    let dump = history.value.slice(0, size);
    while (size && sizeKB(dump) > 5000) {
        size -= 64;
        dump = history.value.slice(0, size);
    }
    await storage.set("history", dump);
    return true;
}

history.add = (data) => {
    history.value = history.value.filter(h => h.kanji !== data.kanji)
    history.value.unshift(data);
}

export default history;
