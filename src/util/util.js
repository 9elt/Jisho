export function sizeKB(v) {
    return Math.ceil(JSON.stringify(v).split("").length >> 10);
}

export function actionLabel(str) {
    return capitalize(str.replace("on", "lookup "));
}

export function capitalize(str) {
    return str.replace(/(^\w{1})|(\s+\w{1})/g, s => s.toUpperCase());
}
