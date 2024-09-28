const { constants, appendLineToFile } = require("@tmux-node-adapter/lib")

const { SET_GLOBAL } = constants.TMUX

/**
 * Basic class for setting tmux properties
 * @param {string} buildPath
 * @param {boolean} debug - if `true`, config file will not created
 */
class TmuxPropsBuilder {
    #buildPath = ""
    #debug = false
    #tmuxProps = new Map([])

    constructor({ buildPath, debug }) {
        this.#buildPath = buildPath || constants.BUILD_PATH
        this.#debug = debug || false
    }

    /**
     * Set tmux property.
     *
     * Example:
     * ```javascript
     * tmuxPropsBuilder.setProperty('status-fg', 'colors_normal_muted')
     * ```
     *
     * Turns in:
     * ```bash
     * set -g status-fg "${colors_normal_muted}"
     * ```
     *
     * @param {string} property
     * @param {string} value
     */
    setProperty(property, value) {
        if (this.#tmuxProps.has(property)) {
            throw new TypeError(
                `Property - ${property} was already set was already set.`,
            )
        }

        this.#tmuxProps.set(property, value)

        return this
    }

    /**
     * Create concent for attribute
     * @param {string} key
     * @param {string} value
     */
    #getContent(key, value) {
        return `${SET_GLOBAL} ${key} ` + '"' + value + '"' + constants.NEW_LINE
    }

    /**
     * Appends all properties, set by `setProperty` method to `build.tmux` file.
     *
     * All properties are setted globally with `-g` flag.
     */
    build() {
        this.#tmuxProps.forEach((value, key) => {
            if (value) {
                const content = this.#getContent(key, value)

                if (this.#debug) {
                    console.group()
                    console.log("KEY: ", key)
                    console.log("VALUE: ", value)
                    console.log("CONTENT: ", content)
                    console.groupEnd()
                } else appendLineToFile(content, this.#buildPath)
            }
        })
    }
}

module.exports = TmuxPropsBuilder
