const SELECTORS = {
  DEFINITION: {
    EXACT_MATCH: "exact_block",
    WRAPPER: "#primary .concept_light.clearfix",
    LINK: ".light-details_link",
    KANJIS: ".text",
    FURIGANA: ".furigana>span",
    TAGS: ".meanings-wrapper .meaning-tags",
    MEANINGS: ".meanings-wrapper .meaning-meaning",
  },
  KANJI: {
    MEANINGS: ".kanji-details__main-meanings",
    READINGS: ".kanji-details__main-readings-list",
    JLPT: ".kanji_stats>.jlpt>strong",
  },
}

/**
 * Jisho.org scraper
 */
class JishoScraper extends JishoRequests {
  constructor() {
    super()

    this.history = {
      definitions: {},
      kanjis: {},
    }
  }

  /**
   * scrape jisho search page
   */
  async definitions(phrase) {
    const definition_page = await this.request_definition(phrase)

    if (definition_page.error) {
      return definition_page
    }

    const definition_wrappers = definition_page
      .dom.querySelectorAll(SELECTORS.DEFINITION.WRAPPER)

    const definitions = []

    Array.from(definition_wrappers).slice(0, 3).forEach(w => {
      const jisho_link = w.querySelector(SELECTORS.DEFINITION.LINK)?.href
      const is_exact_match = w.parentElement?.classList?.contains(SELECTORS.DEFINITION.EXACT_MATCH)

      const kanjis = w.querySelector(SELECTORS.DEFINITION.KANJIS)?.textContent?.trim().split("")
      const furigana = w.querySelectorAll(SELECTORS.DEFINITION.FURIGANA)

      const word = kanjis?.map((kanji, i) => ({
        kanji: kanji ?? "",
        furigana: furigana[i]?.textContent?.trim(),
      }))

      const tags = w.querySelectorAll(SELECTORS.DEFINITION.TAGS)
      const mngs = w.querySelectorAll(SELECTORS.DEFINITION.MEANINGS)

      const meanings = Array.from(mngs).map((meaning, i) => ({
        meaning: meaning?.textContent?.split(";") ?? [],
        tag: tags?.[i]?.textContent ?? "",
      }))

      definitions.push({
        word: word ?? [],
        meanings: meanings ?? [],
        is_exact_match: is_exact_match ?? false,
        jisho_link: jisho_link ?? "https://jisho.org",
      })
    })

    definition_page.remove_dom_elems()
    return definitions
  }

  /**
   * scrape jisho kanji page
   */
  async kanji(kanji) {
    const kanji_page = await this.request_kanji(kanji)

    if (kanji_page.error) {
      return kanji_page
    }

    const jlpt = kanji_page
      .dom
      .querySelector(SELECTORS.KANJI.JLPT)?.textContent ?? "N/A"

    const meanings = kanji_page
      .dom
      .querySelector(SELECTORS.KANJI.MEANINGS)?.textContent?.trim()?.split(",") ?? []

    const readings = kanji_page.dom.querySelectorAll(SELECTORS.KANJI.READINGS)

    const kun_readings = readings?.[0]?.textContent.trim().split("、 ") ?? []
    const on_readings = readings?.[1]?.textContent.trim().split("、 ") ?? []

    const strokes = !kanji_page.svg.error
      ? this.parse_kanji_strokes(kanji_page.svg)
      : []

    kanji_page.remove_dom_elems()

    const kanji_info = {
      kanji: kanji,
      readings: {
        kun: kun_readings,
        on: on_readings,
      },
      meanings: meanings,
      strokes: strokes,
      jlpt: jlpt,
      jisho_link: kanji_page.url,
    }

    return kanji_info
  }

  parse_kanji_strokes(svg) {
    // remove stroke numbers
    svg.children?.[1]?.remove()

    const strokes = []
    const paths = svg.querySelectorAll("path")

    // generate an svg for each stroke
    // with `previous` and `current` strokes
    paths.forEach((path, i) => {
      const svg_clone = svg.cloneNode(true)
      const paths_clone = svg_clone.querySelectorAll("path")

      // previous and current paths
      paths_clone.forEach((path_clone, clone_i) => {
        path_clone.classList.add(
          clone_i == i
            ? "current"
            : clone_i < i
              ? "previous" : "next"
        )
      })

      const path_points = path.getAttribute("d")?.replaceAll("C", "c")

      // add current stroke starting dot
      const sp = path_points.split("M")?.[1]?.split(",")
      const starting_point = {
        x: sp?.[0],
        y: sp?.[1]?.split("c")?.[0]
      }

      if (starting_point.x && starting_point.y) {
        const stroke_starting_dot = `\
          <circle \
            cx="${starting_point.x}" \
            cy="${starting_point.y}" \
            r="${5}" \
          />`

        svg_clone.innerHTML += stroke_starting_dot
      }

      strokes.push(svg_clone)
    })

    return strokes
  }
}
