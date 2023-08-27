import { BROWSER } from "./interop";

const storage = {
    async get(key) {
        const value = await BROWSER.storage.local.get(key);
        return value[key] ? JSON.parse(value[key]) : undefined;
    },
    async set(key, value) {
        BROWSER.storage.local.set({ [key]: JSON.stringify(value) });
    },
}

export default storage;
