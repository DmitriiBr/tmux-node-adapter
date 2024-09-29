/**
 * Class, that helps creating a single block of tmux UI
 */
class TmuxBlockBuilder {
    #modifiers = []
    #uniqueMethodsMap = new Map()
    #reset = "nobold,noitalics,nounderscore"

    /**
     * Handle error, if such property exists in map
     * @param {string} property - `"bold" | "foreground" | "background"`
     * @param {string} value
     */
    handleError(property, value) {
        if (this.#uniqueMethodsMap.has(property)) {
            throw new TypeError(`"${property}" was already declared`)
        }

        if (property !== "bold") {
            if (!value) {
                throw new TypeError(
                    `"${property}" with empty value cannot be defined`,
                )
            }

            if (typeof value !== "string") {
                throw new TypeError(`"${property}" should be "string" type`)
            }
        }
    }

    /**
     * Set block foreground color
     * @param {string} value
     */
    foreground(value) {
        this.handleError("foreground", value)

        this.#modifiers.push(`fg=${value}`)
        this.#uniqueMethodsMap.set("foreground", true)

        return this
    }

    /**
     * Set block background color
     * @param {string} color - should be in hex format
     */
    background(value) {
        this.handleError("background", value)

        this.#modifiers.push(`bg=${value}`)
        this.#uniqueMethodsMap.set("background", true)

        return this
    }

    /** Set block font weight to bold */
    bold() {
        this.handleError("bold")

        this.#modifiers.push(`bold`)
        this.#uniqueMethodsMap.set("bold", true)

        return this
    }

    /**
     * Finish Tmux block creation and returns block, that can be uset like value for property
     *
     * @returns {string} constructed string
     */
    create() {
        const block = this.#modifiers.join(",")

        this.#uniqueMethodsMap.clear()

        return `#[${block}]`
    }
}

module.exports = TmuxBlockBuilder
