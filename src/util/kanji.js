export function isKanji(char) {
    return /^[\u4e00-\u9faf]+$/.test(char)
        || /^[\u3400-\u4dbf]+$/.test(char);
}

/**
 * @param {string} str
 * @param {string} trail
 * @returns {[string, string]} `[kanji char, next trail]`
 */
export function cycleKanji(str, trail) {
    let carry = "";
    let i = 0;
    let t = 0;

    while (i < str.length && (
        !isKanji(str.charAt(i)) ||
        str.charAt(i) === (trail.charAt(t++) || (carry = trail))
    ))
        i++;

    return t === trail.length && !isKanji(str.charAt(i))
        ? [trail.charAt(0), trail.charAt(0)]
        : [str.charAt(i), carry + str.charAt(i)];
}
