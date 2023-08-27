export const BROWSER = typeof chrome === "undefined" ? browser : chrome;

export function request(request, target) {
    return new Promise(target === "TAB"
        ? (resolve, reject) => BROWSER.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
            BROWSER.tabs.sendMessage(id, request, r => r.error ? reject(r) : resolve(r));
        })
        : (resolve, reject) => BROWSER.runtime.sendMessage(request, r => r.error ? reject(r) : resolve(r))
    );
}

export function listen(type, f) {
    BROWSER.runtime.onMessage.addListener((req, _, res) => {
        if (req.type === type) {
            const result = f(req);
            result instanceof Promise
                ? result.then(r => res(r))
                : res(r);
            return true;
        }
    });
}
