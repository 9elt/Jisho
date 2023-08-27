import { BROWSER } from "./interop";

export const VERSION = BROWSER.runtime.getManifest().version;

export const PRACTISE_SHEET_URL = "https://9elt.github.io/Jisho/practise";

export const DEFAULT_SHORTCUTS = {
    onDefinition: {
        code: "KeyY",
        ctrlKey: true,
        shiftKey: true,
        altKey: false,
    },
    onKanji: {
        code: "KeyY",
        ctrlKey: true,
        shiftKey: false,
        altKey: false,
    },
};

export const SYSTEM_COLOR_SCHEME = matchMedia("(prefers-color-scheme: dark)")
    .matches ? "dark" : "ligth";
