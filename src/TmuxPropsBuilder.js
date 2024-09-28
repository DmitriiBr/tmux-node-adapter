const { constants, appendLineToFile } = require("@tmux-node-adapter/lib")

const { SET_GLOBAL } = constants.TMUX

/**
 * Basic class for setting tmux properties
 */
class TmuxPropsBuilder {
    #buildPath = ""
    #tmuxProps = new Map([])

    constructor(buildPath) {
        this.#buildPath = buildPath || constants.BUILD_PATH
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
     * Appends all properties, set by `setProperty` method to `build.tmux` file.
     *
     * All properties are setted globally with `-g` flag.
     */
    buildStyles() {
        this.#tmuxProps.forEach((value, key) => {
            if (value) {
                const content =
                    `${SET_GLOBAL} ${key} ` +
                    '"${' +
                    value +
                    '}"' +
                    constants.NEW_LINE

                appendLineToFile(content, this.#buildPath)
            }
        })
    }
}

module.exports = TmuxPropsBuilder
