import logo from "./logo";
import { VERSION } from "../../util/consts";

const header = {
    tagName: "header",
    children: [
        {
            tagName: "div",
            children: [
                logo,
                {
                    tagName: "h2",
                    children: ["Jisho", " | ", { tagName: "span", children: ["On The Fly"] }]
                }
            ]
        },
        {
            tagName: "div",
            children: [{
                tagName: "span",
                children: [VERSION],
            }]
        }
    ]
};

export default header;
