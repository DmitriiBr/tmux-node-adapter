/**
 * Class, that helps creating a single block of tmux UI
 */
class TmuxBlockBuilder {
    #tests = []
    #uniqueMethodsMap = new Map()
    #reset = "nobold,noitalics,nounderscore"

    /**
     * Handle error, if such property exists in map
     * @param {string} property
     */
    handleError(property) {
        if (this.#uniqueMethodsMap.has(property)) {
            throw new TypeError(
                `"${property}" was already declared was already declared`,
            )
        }
    }

    /**
     * Set block foreground color
     * @param {string} value
     */
    foreground(value) {
        this.handleError("foreground")

        this.#tests.push(`fg=${value}`)
        this.#uniqueMethodsMap.set("foreground", true)

        return this
    }

    /**
     * Set block background color
     * @param {string} color - should be in hex format
     */
    background(value) {
        this.handleError("background")

        this.#tests.push(`bg=${value}`)
        this.#uniqueMethodsMap.set("background", true)

        return this
    }

    /** Set block font weight to bold */
    bold() {
        this.handleError("bold")

        this.#tests.push(`bold`)
        this.#uniqueMethodsMap.set("bold", true)

        return this
    }

    /**
     * Finish Tmux block creation and returns block, that can be uset like value for property
     *
     * @returns {string} constructed string
     */
    create() {
        const block = this.#tests.join(",")

        this.#uniqueMethodsMap.clear()

        return `#[${block}]`
    }
}

module.exports = TmuxBlockBuilder
