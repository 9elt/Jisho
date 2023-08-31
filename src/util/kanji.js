export function isKanji(char) {
    return /[\u4e00-\u9faf|\u3400-\u4dbf]/.test(char);
}

/**
 * @param {string} search
 * @param {string} trail
 * @returns {string} `next trail`
 */
export function cycleKanji(search, trail) {
    let carry = "";
    let s = 0;
    let t = 0;
    while (s < search.length && (
        !isKanji(search.charAt(s)) ||
        search.charAt(s) === (trail.charAt(t++) || (carry = trail))
    ))
        s++;
    return t === trail.length && !isKanji(search.charAt(s))
        ? trail.charAt(0)
        : carry + search.charAt(s);
}
