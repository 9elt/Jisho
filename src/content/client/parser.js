export default class Parser {
    constructor() { }
    definitions(html) {
        const page = document.createElement("div");
        page.innerHTML = html;

        return [...page.querySelectorAll("#primary .concept_light.clearfix")].slice(0, 3).map(W => {
            const link = "https:" + W.querySelector(".light-details_link")?.dataset.href;
            const exact = W.parentElement.classList.contains("exact_block");
            const furigana = W.querySelectorAll(".furigana>span");
            const word = W.querySelector(".text")?.textContent?.trim().split("")?.map((kanji, i) => ({
                kanji: kanji ?? "",
                furigana: furigana[i]?.textContent?.trim(),
            })) ?? [];
            const tags = W.querySelectorAll(".meanings-wrapper .meaning-tags");
            const meanings = [...W.querySelectorAll(".meanings-wrapper .meaning-meaning")].map((meaning, i) => ({
                meaning: meaning?.textContent?.split(";") ?? [],
                tag: tags?.[i]?.textContent ?? "",
            }));
            return { link, word, meanings, exact };
        });
    }
    kanji(html, svg, link) {
        const page = document.createElement("div");
        page.innerHTML = html;
        const kanji = page.querySelector("h1.character")?.textContent ?? "";
        const jlpt = page.querySelector(".kanji_stats>.jlpt>strong")?.textContent ?? "N/A";
        const grade = page.querySelector(".kanji_stats>.grade>strong")?.textContent?.replace('grade ', '') ?? "N/A";
        const meanings = page.querySelector(".kanji-details__main-meanings")?.textContent?.trim().split(",") ?? [];
        const readings = page.querySelectorAll(".kanji-details__main-readings-list");
        const kun = readings?.[0]?.textContent.trim().split("、 ") ?? [];
        const on = readings?.[1]?.textContent.trim().split("、 ") ?? [];
        const strokes = this.__strokes(svg);

        return {
            link,
            kanji,
            meanings,
            readings: { kun, on },
            strokes,
            jlpt,
            grade,
        };
    }
    __strokes(svg) {
        const page = document.createElement("div");
        page.innerHTML = svg;
        const svgElement = page.querySelector("svg");
        const viewBox = svgElement?.getAttribute("viewBox");
        const paths = [...svgElement.querySelectorAll("path")].map(path => path.getAttribute("d"));
        const base = {
            tagName: "svg",
            namespaceURI: "http://www.w3.org/2000/svg",
            viewBox,
            children: paths.map(d => ({
                tagName: "path",
                namespaceURI: "http://www.w3.org/2000/svg",
                d,
            })),
        }
        return paths.map((d, i) => {
            const curr = structuredClone(base);
            for (let p = 0; p < curr.children.length; p++) {
                curr.children[p].className = p === i ? "current" : p < i ? "previous" : "next"
            }
            const points = d?.replaceAll("C", "c").split("M")?.[1]?.split(",");
            const sp = { x: points?.[0], y: points?.[1]?.split("c")?.[0] };
            if (sp.x && sp.y) {
                curr.children.push({
                    tagName: "circle", cx: sp.x, cy: sp.y, r: "5",
                    namespaceURI: "http://www.w3.org/2000/svg",
                });
            }
            return curr;
        });
    }
}
