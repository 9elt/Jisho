const ENDPOINTS = {
  definition: (phrase) => `https://jisho.org/search/${encodeURI(phrase)}`,
  kanji: (kanji) => `https://jisho.org/search/${encodeURI(kanji)}%20%23kanji`,
}

/**
 * Jisho.org requests
 */
class JishoRequests {
  constructor() { }

  error(message) {
    return {
      error: message
    }
  }

  /**
   * get jisho.org definition page
   */
  async request_definition(phrase) {
    const dom = document.createElement("div")

    const endpoint = ENDPOINTS.definition(phrase)
    const scraped = await this.request(endpoint)

    if (scraped.error) {
      return scraped
    }

    dom.innerHTML = await scraped

    return {
      dom: dom,
      url: endpoint,
      remove_dom_elems: () => {
        dom?.remove()
      }
    }
  }

  /**
   * get jisho.org kanji page
   */
  async request_kanji(kanji) {
    const dom = document.createElement("div")

    const endpoint = ENDPOINTS.kanji(kanji)

    const scraped = await this.request(endpoint)

    dom.innerHTML = await scraped
    const svg = await this.request_kanji_strokes(scraped)

    if (svg.error) {
      return svg
    }

    return {
      dom: dom,
      svg: svg,
      url: endpoint,
      remove_dom_elems: () => {
        dom?.remove()
        svg?.remove()
      }
    }
  }

  /**
   * get kanji strokes svg
   */
  async request_kanji_strokes(scraped_html) {
    const svg = document.createElement("div")
    const svg_url = scraped_html.split("var url = '")?.[1]?.split("';")?.[0]

    if (!svg_url) {
      return this.error("cannot find kanji")
    }

    const svg_str = await this.request("https:" + svg_url)

    if (!svg_str) {
      return this.error("failed parsing kanji strokes")
    }

    svg.innerHTML = svg_str

    return svg.querySelector("svg")
      ?? this.error("missing svg")
  }

  /**
   * sanitize unsafe html,
   * prevent media from loading
   */
  sanitize_html(scraped_html) {
    try {
      scraped_html = scraped_html
        .replaceAll("<use xlink:href=", "<p data-use=")
        .replaceAll("></use>", "></p>")
        .replaceAll("src=", "data-src=")

      return scraped_html
    } catch {
      return this.error("failed sanitizing html")
    }
  }

  /**
   * background worker fetch request
   */
  request(endpoint) {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        scrape: true,
        url: endpoint
      },
        scraped_html => scraped_html
          ? resolve(this.sanitize_html(scraped_html))
          : reject(this.error("request to jisho.org failed"))
      )
    })
  }
}
