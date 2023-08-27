import Parser from "./parser";
import Requests from "./requests";

class JishoClient {
    constructor() {
        this.__parser = new Parser();
        this.__requests = new Requests();
    }
    async definitions(phrase) {
        const res = await this.__requests.definitions(phrase);
        return this.__parser.definitions(res);
    }
    async kanji(kanji) {
        const res = await this.__requests.kanji(kanji);
        return this.__parser.kanji(...res);
    }
}

const jisho = new JishoClient();
export default jisho;
