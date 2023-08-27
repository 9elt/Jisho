export function sizeKB(v) {
    return Math.ceil(JSON.stringify(v).split("").length >> 10);
}
