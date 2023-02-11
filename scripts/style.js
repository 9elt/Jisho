const JISHO_STYLE=`
.dark {
    --bg: #24231fbf;
    --bg-2: #0002;
    --color: #fff;
    --accent: #51bd00;
    --accent-low: #a2d979;
    --shadow: #0006;
}

.light {
    --bg: #f9f9f982;
    --bg-2: #ffffff5e;
    --color: #404040;
    --accent: #51bd00;
    --accent-low: #a2d979;
    --shadow: #b3b3b366;
}

#jisho-gui {
    position: fixed;

    top: 8px;
    left: calc(50% - 324px);

    width: calc(98% - 32px);
    max-width: 612px;

    padding: 0 16px;

    border-radius: 24px;
    color: var(--color);
    background-color: var(--bg);
    box-shadow: 0 10px 20px #0005, inset 0 0 100px 8px var(--bg-2);

    transition: all 0.5s ease-in-out;
    backdrop-filter: blur(24px);
    z-index: 999999;

    font-family: "Helvetica Neue", "Helvetica", "Arial", "Source Han Sans",
        "源ノ角ゴシック", "Hiragino Sans", "HiraKakuProN-W3",
        "Hiragino Kaku Gothic ProN W3", "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3",
        "Noto Sans", "Noto Sans CJK JP", "メイリオ", "Meiryo", "游ゴシック", "YuGothic",
        "ＭＳ Ｐゴシック", "MS PGothic", "ＭＳ ゴシック", "MS Gothic", sans-serif;
}

#jisho-gui {
    max-height: 0;
    pointer-events: none;
    overflow: hidden;
}

#jisho-gui.active {
    padding-top: 16px;
    max-height: 520px;
    pointer-events: all;
}

@media only screen and (max-width: 612px) {
    #jisho-gui {
        left: 1%;
    }
}

::-webkit-scrollbar {
    width: 14px;
}

::-webkit-scrollbar-track {
    background-color: transparent;
}

::-webkit-scrollbar-thumb {
    background-color: var(--bg-2);
    border-radius: 7px;
}

::selection {
    background-color: var(--accent);
}

/* loader */

.loader>svg {
    width: 64px;
    height: 64px;
    display: block;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 16px;
    fill: var(--accent);
}

.loader>svg>path:first-child {
    animation-delay: .5s !important;
}

.loader.active>svg>path {
    animation: loaderAnimation 1s infinite;
}

@keyframes loaderAnimation {
    0% {
        fill: var(--accent);
    }

    50% {
        fill: var(--accent-low);
    }

    100% {
        fill: var(--accent);
    }
}

/* error */

.error>h4 {
    text-align: center;
    font-size: 20px;
    margin: 0;
    padding-top: 10px;
    padding-bottom: 26px;
}

/* KANJI LOOKUP */

.kanji-info {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-bottom: 16px;
}

/* title */

.kanji-info .heading {
    width: 136px;
}

.kanji-info .heading h2 {
    color: var(--color);
    margin: 0;
    font-size: 96px;
    line-height: 120px;
}

.kanji-info .heading a,
.definition-info .word a,
.kanji-jlpt {
    display: block;
    width: 90%;
    font-size: 18px;
    line-height: 28px;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    border-radius: 6px;
    background-color: var(--accent);
    color: #fff !important;
}

.kanji-jlpt {
    margin: 0;
    color: var(--color) !important;
    background-color: var(--bg);
}

/* readings and meanings */

.kanji .readings-meanings {
    border-radius: 4px;
    padding: 0 8px 0 8px;
    width: 100%;
}

.kanji ul {
    text-align: center;
    width: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
    margin: 8px 0 8px 0;
    font-size: 20px;
    line-height: 20px;
}

.kanji ul.meanings,
.kanji-history {
    border-radius: 6px;
    background-color: var(--bg-2);
    box-shadow: inset 0 0 30px var(--shadow);
}

.kanji li {
    display: inline-block;
    padding: 3px 8px;
    margin: 3px;
    border-radius: 3px;
    background-color: var(--bg-2);
}

.kanji li.title,
.kanji ul.meanings>li,
.kanji-history>li {
    background: none;
}

.kanji li.title {
    font-weight: bold;
}

/* stroke order */

.stroke-order {
    text-align: center;
}

.stroke-order svg {
    width: 65px;
}

.stroke-order path.previous {
    opacity: .8;
    stroke: var(--color);
}

.stroke-order path.current {
    opacity: 1;
    stroke: var(--accent);
}

.stroke-order path.next {
    opacity: .2;
    stroke: var(--color);
}

.kanji circle {
    fill: var(--accent);
}

/* bottom bar */

.bottom-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.close-gui {
    font-weight: bold;
    font-size: 14px;
    margin: 0 0 0 16px;
    text-align: center;
    cursor: pointer;
    text-transform: uppercase;
}

.kanji-history {
    border-radius: 6px;
    margin: 8px 0 8px 0;
    font-size: 20px;
    line-height: 20px;
    min-height: 32px;
    box-shadow: inset 0 0 30px var(--shadow);
    text-align: left !important;
}

.kanji-history>li {
    cursor: pointer;
}

/* DEFINITION LOOKUP */

.definition-info ul {
    padding: 0;
    margin: 0;
    list-style: none;
}

.definition-info .word a {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
}

.definition-info .word ul {
    margin: 16px auto 16px auto;
    padding: 16px;
    border-radius: 8px;
    width: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--bg-2);
    box-shadow: inset 0 0 30px var(--shadow);
}

.definition-info .word li {
    font-size: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.definition-info .word .furigana {
    font-size: 20px;
}

.definition-info .meanings {
    text-align: center;
    border-radius: 4px;
    margin-bottom: 10px;
    max-height: 199px;
    overflow: auto;
    padding-top: 5px;
}

.definition-info .tag {
    width: 90%;
    opacity: 0.5;
    margin: 0 auto 0 auto;
    text-transform: lowercase;
}

.definition-info .meaning {
    margin: 5px 0 8px 0;
}

.definition-info .meaning li {
    display: inline-block;
    font-size: 24px;
    margin: 0px 6px 6px 6px;
    padding: 2px 5px 2px 5px;
    border-radius: 4px;
    background-color: var(--bg-2);
}

/* .definition-info .meaning li.index {
    background-color: var(--accent);
    box-shadow: 0 0 2px var(--accent);
    font-size: 14px;
    font-weight: bold;
    position: relative;
    top: -3px;
    border-radius: 7px;
    color: #0008;
} */

.definition .bottom-bar ul {
    border-radius: 6px;
    background-color: var(--bg-2);
    margin: 8px 0 8px 0;
    font-size: 20px;
    line-height: 20px;
    box-shadow: inset 0 0 30px var(--shadow);
    padding-left: 0;
}

.definition .bottom-bar li {
    cursor: pointer;
    display: inline-block;
    padding: 3px 8px;
    margin: 5px;
    border-radius: 5px;
}

.definition .bottom-bar li span {
    font-size: 14px;
    opacity: 0.5;
    margin-left: 5px
}

.definition .bottom-bar li.active {
    background-color: var(--accent);
    box-shadow: 0 0 2px var(--accent);
}

`