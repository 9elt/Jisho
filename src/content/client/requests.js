import { request } from "../../util";

export default class Request {
    constructor() { }

    async definitions(phrase) {
        const url = "https://jisho.org/search/" + encodeURI(phrase);
        return await this.__request(url);
    }

    async kanji(kanji) {
        const url = "https://jisho.org/search/" + encodeURI(kanji) + "%20%23kanji";
        const html = await this.__request(url);

        const svgUrl = "https:" + /var url = '([^)]+)';/.exec(html)?.[1];
        const svg = await this.__request(svgUrl);

        return [html, svg, url];
    }

    async __request(url) {
        const res = await request({ type: "GET", url });
        return this.__sanitize(res);
    }

    __sanitize(html) {
        try {
            return html
                .replaceAll("<use xlink:href=", "<p data-use=")
                .replaceAll("></use>", "></p>")
                .replaceAll("src=", "data-src=")
                .replaceAll("href=", "data-href=");
        }
        catch {
            throw { code: 500 };
        }
    }
}
