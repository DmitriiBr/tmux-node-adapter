/**
 * Class, that helps creating a single block of tmux UI
 */
class TmuxBlockBuilder {
    static block = ""
    static uniqueMethodsMap = new Map()
    #reset = "nobold,noitalics,nounderscore"

    /**
     * Set block foreground color
     * @param {string} color - should be in hex format
     */
    foreground(color) {
        if (TmuxBlockBuilder.uniqueMethodsMap.has("foreground"))
            throw new TypeError("Foreground was already declared")

        TmuxBlockBuilder.block += `fg=${color},`
        TmuxBlockBuilder.uniqueMethodsMap.set("foreground", true)

        return this
    }

    /**
     * Set block background color
     * @param {string} color - should be in hex format
     */
    background(color) {
        if (TmuxBlockBuilder.uniqueMethodsMap.has("background"))
            throw new TypeError("Background was already declared")

        TmuxBlockBuilder.block += `bg=${color},`
        TmuxBlockBuilder.uniqueMethodsMap.set("background", true)

        return this
    }

    /** Set block font weight to bold */
    bold() {
        if (TmuxBlockBuilder.uniqueMethodsMap.has("bold"))
            throw new TypeError("Bold was already declared")

        TmuxBlockBuilder.block += `bold,`
        TmuxBlockBuilder.uniqueMethodsMap.set("bold", true)

        return this
    }

    /**
     * Finish Tmux block creation and returns block, that can be uset like value for property
     *
     * @returns {string} constructed string
     */
    create() {
        const block = TmuxBlockBuilder.block

        TmuxBlockBuilder.block = ""
        TmuxBlockBuilder.uniqueMethodsMap.clear()

        return `#[${block}]`
    }
}

module.exports = TmuxBlockBuilder
