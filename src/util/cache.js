import history from "./history";

const cache = {
    kanji: {},
    definitions: {}
};

cache.ok = (async () => {
    await history.ok;
    if (history.value.length) {
        history.value.forEach(data => cache.kanji[data.kanji] = data);
        console.log("cache initialized from history");
    }
    return true;
})();

export default cache;
