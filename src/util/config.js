import { State } from "@9elt/miniframe";
import { request } from "./interop";

import storage from "./storage";

import { SYSTEM_COLOR_SCHEME, DEFAULT_SHORTCUTS } from "./consts";

/** 
 * @type {State<{
 *     theme: typeof SYSTEM_COLOR_SCHEME;
 *     actions: typeof DEFAULT_SHORTCUTS;
 * }> & {
 *     ok: Promise<boolean>;
 *     save: () => Promise<boolean>;
 *     sync: () => Promise<boolean>;
 * }} 
 */
const config = new State({});

config.sync = async () => {
    config.value = {
        ...config.value,
        theme: (await storage.get("theme")) ?? SYSTEM_COLOR_SCHEME,
        actions: (await storage.get("actions")) ?? DEFAULT_SHORTCUTS,
    };
    return true;
}

config.save = async () => {
    await storage.set("theme", config.value.theme);
    await storage.set("actions", config.value.actions);
    await request({ type: "SYNC-CONFIG" }, "TAB");
    return true;
}

config.ok = config.sync();

export default config;
