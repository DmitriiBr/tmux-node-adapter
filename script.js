const Fs = require("node:fs")
const Path = require("node:path")
const Os = require("node:os")

const HOME_DIRECTORY = Os.homedir()
const BUILD_PATH = "~/.config/tmux/build.tmux"
const CONFIG_PATH = "~/.config/tmux/tmux.conf.json"

const UNDERSCORE = "_"
const NEW_LINE = "\n"
const SET_GLOBAL = "set -g"

const STATUS_BG = "status-bg"
const STATUS_FG = "status-fg"

const untildify = (pathWithTilde) => {
    const path = HOME_DIRECTORY + pathWithTilde.slice(1).replace(/\\/g, "/")

    return path
}

const appendLineToFile = (content) => {
    Fs.appendFile(untildify(BUILD_PATH), content, (err) => {
        if (err) throw new Error(err)
    })
}

class TmuxStylesBuilder {
    #tmuxStyles = new Map([
        [STATUS_BG, ""],
        [STATUS_FG, ""],
    ])

    constructor(buildPath) {
        this.buildPath = buildPath || BUILD_PATH
    }

    setProperty(property, value) {
        if (!this.#tmuxStyles.has(property)) {
            throw new TypeError("No such propety: " + property)
        }

        this.#tmuxStyles.set(property, value)

        return this
    }

    buildStyles() {
        this.#tmuxStyles.forEach((value, key) => {
            if (value) {
                const content =
                    `${SET_GLOBAL} ${key} ` + '"${' + value + '}"' + NEW_LINE

                appendLineToFile(content)
            }
        })
    }
}

const createVariable = (key, value) => {
    const content = `${key}="${value}"${NEW_LINE}`

    appendLineToFile(content)
}

const buildFromConfiguration = (configPath) => {
    return new Promise((resolve, reject) => {
        Fs.readFile(
            untildify(configPath),
            { encoding: "utf8" },
            (err, data) => {
                if (err) reject(err)

                resolve(data)
            },
        )
    })
        .then((data) => {
            const jsonTmuxConfig = JSON.parse(data)

            const recursivelyAppendAttributes = (node, attr) => {
                if (typeof node === "string") {
                    const key = attr.slice(0, -1)

                    createVariable(key, node)

                    return
                }

                for (const key in node) {
                    const nextAttr = attr ? attr + key : key

                    recursivelyAppendAttributes(
                        node[key],
                        nextAttr + UNDERSCORE,
                    )
                }
            }

            recursivelyAppendAttributes(jsonTmuxConfig)
        })
        .catch((err) => {
            throw new Error(err)
        })
}

const main = async () => {
    await buildFromConfiguration(CONFIG_PATH)

    const tmuxStyles = new TmuxStylesBuilder()

    tmuxStyles
        .setProperty(STATUS_BG, "colors_statusline_background")
        .setProperty(STATUS_FG, "colors_statusline_foreground")
        .buildStyles()
}

main()
