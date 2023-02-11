const SHADOW_ROOT_ID = "jisho-shadow-root"
const LOADER_TIMEOUT_MS = 5_000

class JishoGui {
  constructor() {
    this.theme = "dark"
    this.active = false
  }

  /**
   * initialize gui
   */
  init() {
    const container = document.createElement("div")
    container.id = SHADOW_ROOT_ID

    this.gui = _({
      id: "jisho-gui",
      className: this.theme ?? "dark",
      children: _()
    })

    const shadow = container.attachShadow({ mode: 'open' })
    shadow.appendChild(_({
      tagName: "style",
      innerHTML: JISHO_STYLE
    }))
    shadow.appendChild(this.gui)

    document.body.append(container)
    this.init_log()
  }

  /**
   * check if the gui is in the current page
   * if not, initialize it
   */
  check = () => {
    if (!document.getElementById(SHADOW_ROOT_ID)) {
      this.init()
    }
  }

  /**
   * open the gui
   */
  open = () => {
    this.check()

    this.gui.classList.add("active")
    this.active = true
  }

  /**
   * close the gui
   */
  close = () => {
    this.check()

    this.gui.classList.remove("active")
    this.active = false
  }

  /**
   * set the gui theme
   */
  set_theme = (theme) => {
    this.check()

    this.gui.classList.remove(this.theme)
    this.gui.classList.add(theme)
    this.theme = theme
  }

  /**
   * replace the gui content
   */
  set_content = (content) => {
    this.check()

    this.gui.replaceChildren(content)
  }

  /**
   * render the gui loader
   */
  loader = ({ on_timeout = () => { } }) => {
    this.set_content(
      _({
        className: "loader",
        innerHTML: `
        <svg x="0px" y="0px" viewBox="0 0 64 64">\
          <path \
            d="M33.4,49.6c0,0.1,0.2,0.2,0.2,0c0.6-1.8,2.6-5.2,\
              9-5.2h15.8c0.4,0,0.8-0.3,0.8-0.8V15c0-0.4-0.3-0.8-0.8-0.8\
              H40.7c0,0-7.3,0-7.3,7.7C33.4,28,33.4,45,33.4,49.6z"\
          />\
          <path \
            d="M30.6,49.6c0,0.1-0.2,0.2-0.2,0c-0.6-1.8-2.6-5.2-9-5.2H5.5\
              c-0.4,0-0.8-0.3-0.8-0.8V15c0-0.4,0.3-0.8,0.8-0.8h17.7\
              c0,0,7.3,0,7.3,7.7C30.6,28,30.6,45,30.6,49.6z"\
          />\
        </svg>\
      `
      })
    )

    setTimeout(() => {
      if (this.gui?.querySelector(".loader")) {
        on_timeout()
      }
    }, LOADER_TIMEOUT_MS)
  }

  /**
   * render a gui error
   */
  error = (message = "an error occurred") => {
    this.set_content(
      _({
        className: "error",
        children: _({
          tagName: "h4",
          textContent: message
        })
      })
    )
  }

  /**
   * render a kanji definition
   * and kanji lookup history
   */
  kanji = (kanji, { kanji_history, lookup_callback }) => {
    this.set_content(
      _({
        className: "kanji",
        children: [
          _({
            className: "kanji-info",
            children: [
              _({
                className: "heading",
                children: [
                  _({
                    tagName: "a",
                    href: kanji.jisho_link,
                    target: "_blank",
                    textContent: "jisho.org",
                  }),
                  _({
                    tagName: "h2",
                    textContent: kanji.kanji,
                  }),
                  _({
                    tagName: "p",
                    className: "kanji-jlpt",
                    textContent: kanji.jlpt,
                  })
                ]
              }),
              _({
                className: "readings-meanings",
                children: [
                  _({
                    tagName: "ul",
                    className: "meanings",
                    children: kanji.meanings
                      .map(meaning => _({
                        tagName: "li",
                        textContent: meaning
                      }))
                  }),
                  _({
                    tagName: "ul",
                    className: "kun-readings",
                    children: [
                      _({
                        tagName: "li",
                        className: "title",
                        textContent: "Kun"
                      }),
                      ...kanji.readings.kun.map(kun_reading =>
                        _({
                          tagName: "li",
                          textContent: kun_reading
                        })
                      )
                    ]
                  }),
                  _({
                    tagName: "ul",
                    className: "on-readings",
                    children: [
                      _({
                        tagName: "li",
                        className: "title",
                        textContent: "On"
                      }),
                      ...kanji.readings.on.map(on_reading =>
                        _({
                          tagName: "li",
                          textContent: on_reading
                        })
                      )
                    ]
                  }),
                ]
              })
            ]
          }),
          _({
            className: "stroke-order",
            children: kanji.strokes,
          }),
          _({
            className: "bottom-bar",
            children: [
              _({
                tagName: "ul",
                className: "kanji-history",
                children: kanji_history.map(kanji => _({
                  tagName: "li",
                  textContent: kanji,
                  on_click: () => lookup_callback(kanji)
                }))
              }),
              _({
                tagName: "p",
                className: "close-gui",
                textContent: "close",
                on_click: () => this.close()
              })
            ]
          })
        ]
      })
    )
  }

  /**
   * render a definition
   */
  definitions = (definitions) => {
    let current = 0
    let current_definition = this.current_definition(definitions[current])

    const buttons = _({
      tagName: "ul",
      className: "definitions-buttons",
      children: definitions.map((definition, i) => _({
        tagName: "li",
        className: i == current ? "active" : "",
        textContent: definition.is_exact_match
          ? "exact match" : "definition",
        children: _({
          tagName: "span",
          textContent: `(${i + 1})`
        }),
        on_click: () => set_current_definition(i)
      }))
    })

    const set_current_definition = (index) => {
      buttons.children?.[current]?.classList.remove("active")
      buttons.children?.[index]?.classList.add("active")

      current = index
      const definition = this.current_definition(definitions[index])
      current_definition?.replaceWith(definition)
      current_definition = definition
    }

    this.set_content(
      _({
        className: "definition",
        children: [
          current_definition,
          _({
            className: "bottom-bar",
            children: [
              buttons,
              _({
                tagName: "p",
                className: "close-gui",
                textContent: "close",
                on_click: () => this.close()
              })
            ]
          })
        ]
      })
    )
  }

  /**
   * create current definition element
   */
  current_definition = (definition) => {
    return _({
      className: "definition-info",
      children: [
        _({
          className: "word",
          children: [
            _({
              tagName: "a",
              href: definition.jisho_link,
              target: "_blank",
              textContent: "jisho.org",
            }),
            _({
              tagName: "ul",
              children: definition.word.map(char =>
                _({
                  tagName: "li",
                  children: [
                    _({
                      tagName: "span",
                      className: "furigana",
                      innerHTML: char.furigana != ""
                        ? char.furigana : "&nbsp"
                    }),
                    _({
                      tagName: "span",
                      className: "kanji",
                      innerHTML: char.kanji != ""
                        ? char.kanji : "&nbsp"
                    }),
                  ]
                })
              )
            })
          ]
        }),
        _({
          className: "meanings",
          children: definition.meanings.map(ms =>
            _({
              className: "meanings-container",
              children: [
                _({
                  tagName: "p",
                  className: "tag",
                  textContent: ms.tag,
                }),
                _({
                  tagName: "ul",
                  className: "meaning",
                  children: ms.meaning.map(meaning =>
                    _({
                      tagName: "li",
                      textContent: meaning
                    })
                  )
                }),
              ]
            })
          )
        })
      ]
    })
  }

  /**
   * console log jisho logo
   */
  init_log = () => {
    // const TEXT = `
    //  ██████╗ ██╗  ████╗  ██╗ ██╗  ████╗
    //   ╚═██╔╝ ██║ ██ ╔═╝  ██║ ██║ ██  ██╗
    //     ██║  ██║  ████╗  ██████║ ██  ██║
    // ██  ██║  ██║   ╚╗██╗ ██╔═██║ ██  ██║
    // ╚████╔╝  ██║ █████╔╝ ██║ ██║  ████╔╝
    //  ╚═══╝   ╚═╝ ╚════╝  ╚═╝ ╚═╝   ╚══╝
    //   jisho.org unofficial extension ╗
    //   ╚══════════════════════════════╝
    // `
    const TEXT = "Jisho extension is running..."

    console.log(
      `%c ${TEXT}`,
      `color: #65b02d; font-weight: bold; text-shadow: 0 0 2px #65b02d;`
    )
  }
}

/**
 * create an HTML element
 */
function _(props) {
  const tagName = props?.tagName ?? "div"
  const elem = document.createElement(tagName)

  props?.id ?
    elem.id = props.id : 0

  props?.className ?
    elem.className = props.className : 0

  props?.href ?
    elem.href = props.href : 0

  props?.target ?
    elem.target = props.target : 0

  props?.src ?
    elem.src = props.src : 0

  props?.textContent ?
    elem.textContent = props.textContent : 0

  props?.innerHTML ?
    elem.innerHTML = props.innerHTML : 0

  props?.children ?
    props.children.length
      ? props.children.forEach(child => elem.append(child))
      : elem.append(props.children) : 0

  props?.parent ?
    props.parent.append(elem) : 0

  props?.on_click ?
    elem.addEventListener("click", () => props.on_click()) : 0

  return elem
}
