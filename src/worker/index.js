import { listen } from "../util";

listen("GET", async ({ url }) => {
    console.log("GET", url);
    try {
        const res = await fetch(url);
        if (res.ok) {
            console.log("OK", res.status);
            return await res.text();
        }
        console.log("ERR", res.status);
        return { error: { code: res.status } };
    }
    catch {
        console.log("ERR", 500);
        return { error: { code: 500 } };
    }
});
