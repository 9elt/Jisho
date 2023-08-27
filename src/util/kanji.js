export function isKanji(char) {
    return /^[\u4e00-\u9faf]+$/.test(char)
        || /^[\u3400-\u4dbf]+$/.test(char);
}

export function firstKanji(str) {
    let i = 0;
    while (i < str.length && !isKanji(str.charAt(i)))
        i++;
    return str.charAt(i);
}

export function cycleKanji(str, streak) {
    let i = 0;
    let s = 0;
    let br;

    while (i < str.length && (
        !isKanji(str.charAt(i)) ||
        str.charAt(i) === (streak.charAt(s++) || (br = true))
    ))
        i++;

    return s === streak.length && !isKanji(str.charAt(i))
        ? [streak.charAt(0), streak.charAt(0)]
        : [str.charAt(i), (br ? streak : "") + str.charAt(i)];
}
