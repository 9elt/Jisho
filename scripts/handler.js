function main() {
  const handler = new JishoHandler()
  handler.listen()
}

class JishoHandler {
  constructor() {
    this.active = true

    this.scraper = new JishoScraper()
    this.gui = new JishoGui()

    this.history = {
      definitions: {},
      kanjis: {},
    }

    this.actions = {
      definition: {
        ctrlKey: true,
        code: "KeyM",
        callback: this.lookup_definition
      },
      kanji: {
        ctrlKey: true,
        code: "KeyY",
        callback: this.lookup_kanji
      },
    }
  }

  listen() {
    window.addEventListener("keydown", e => this.event_router(e))
  }

  /**
   * route keydown events to `this.actions`
   */
  event_router(e) {
    if (!this.active) { return }

    for (const key in this.actions) {
      if (
        e.code == this.actions[key].code
        && e.ctrlKey == this.actions[key].ctrlKey
      ) {
        e.preventDefault()
        this.actions[key].callback()
      }
    }
  }

  /**
   * look up definition from user selection
   */
  lookup_definition = async () => {
    const phrase = this.user_selection()

    if (!phrase) {
      return this.error("invalid selection")
    }

    this.gui.open()
    this.gui.loader({ on_timeout: () => this.error("cannot find definition") })

    const definitions = this.history.definitions[phrase]
      ?? await this.scraper.definitions(phrase)

    if (definitions.error) {
      return this.error(definitions.error)
    }

    this.gui.definitions(definitions)

    this.history.definitions[phrase] = definitions
  }

  /**
   * look up kanji from user selection
   * or from history
   */
  lookup_kanji = async (history_char = undefined) => {
    const char = history_char ?? this.user_selection(1)
    if (!char) {
      return this.error("invalid selection")
    }

    this.gui.open()
    this.gui.loader({ on_timeout: () => this.error("cannot find kanji") })

    const kanji = this.history.kanjis[char]
      ?? await this.scraper.kanji(char)

    if (kanji.error) {
      return this.error(kanji.error)
    }

    this.gui.kanji(
      kanji,
      {
        kanji_history: Object.keys(this.history.kanjis)
          .reverse().slice(0, 12),
        lookup_callback: this.lookup_kanji
      }
    )

    this.history.kanjis[char] = kanji
  }

  /**
   * get user selection, with optional limit
   */
  user_selection(limit = undefined) {
    const selection = window.getSelection()

    const is_backwards = selection.baseOffset > selection.extentOffset

    const start = is_backwards
      ? selection.extentOffset : selection.baseOffset

    const end = is_backwards
      ? selection.baseOffset : selection.extentOffset

    const parsed = selection?.baseNode?.textContent?.substring(start, end)?.trim()

    return limit
      ? parsed.substring(0, limit)
      : parsed
  }

  /**
   * render error message and close the gui
   */
  error(message) {
    this.gui.open()
    this.gui.error(message)
    setTimeout(this.gui.close, 1_500)
  }
}

main()
