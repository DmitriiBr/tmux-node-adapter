const buildFromConfiguration = require("./buildFromConfiguration")

const { constants, appendLineToFile } = require("@tmux-node-adapter/lib")

const SET_GLOBAL = "set -g"
const STATUS_BG = "status-bg"
const STATUS_FG = "status-fg"
const STATUS_LEFT = "status-left"
const DISPLAY_PANES_COLOR = "display-panes-colour"
const DISPLAY_PANES_ACTIVE_COLOR = "display-panes-active-colour"

class TmuxPropsBuilder {
    #tmuxProps = new Map([
        [STATUS_BG, ""],
        [STATUS_FG, ""],
        [DISPLAY_PANES_COLOR, ""],
        [DISPLAY_PANES_ACTIVE_COLOR, ""],
        [STATUS_LEFT, ""],
    ])

    constructor(buildPath) {
        this.buildPath = buildPath || constants.BUILD_PATH
    }

    setProperty(property, value) {
        if (!this.#tmuxProps.has(property)) {
            throw new TypeError("No such propety: " + property)
        }

        this.#tmuxProps.set(property, value)

        return this
    }

    buildStyles() {
        this.#tmuxProps.forEach((value, key) => {
            if (value) {
                const content =
                    `${SET_GLOBAL} ${key} ` +
                    '"${' +
                    value +
                    '}"' +
                    constants.NEW_LINE

                appendLineToFile(content, constants.BUILD_PATH)
            }
        })
    }
}

class TmuxBlockBuilder {
    static block = ""
    static uniqueMethodsMap = new Map()
    #reset = "nobold,noitalics,nounderscore"

    foreground(color) {
        if (TmuxBlockBuilder.uniqueMethodsMap.has("foreground"))
            throw new TypeError("Foreground was already declared")

        TmuxBlockBuilder.block += `fg=${color},`
        TmuxBlockBuilder.uniqueMethodsMap.set("foreground", true)

        return this
    }
    background(color) {
        if (TmuxBlockBuilder.uniqueMethodsMap.has("background"))
            throw new TypeError("Background was already declared")

        TmuxBlockBuilder.block += `bg=${color},`
        TmuxBlockBuilder.uniqueMethodsMap.set("background", true)

        return this
    }

    bold() {
        if (TmuxBlockBuilder.uniqueMethodsMap.has("bold"))
            throw new TypeError("Bold was already declared")

        TmuxBlockBuilder.block += `bold,`
        TmuxBlockBuilder.uniqueMethodsMap.set("bold", true)

        return this
    }

    create() {
        const block = TmuxBlockBuilder.block

        TmuxBlockBuilder.block = ""
        TmuxBlockBuilder.uniqueMethodsMap.clear()

        return `#[${block}]`
    }
}

class TmuxStatus {
    /*
     * @param type
     * left
     * right
     * window
     * window-current
     * */
    constructor(type) {
        this.type = type
    }

    //  set -g status-left "
    //  #[fg=${ROSE_PINE_BLACK},bg=blue,bold]
    //  #S
    //  #[fg=blue,bg=brightblack,nobold,noitalics,nounderscore]"
}

const main = async () => {
    const args = process.argv

    const tmuxPropsBuilder = new TmuxPropsBuilder(constants.BUILD_PATH)
    const blockBuilder = new TmuxBlockBuilder()

    const leftBlock1 = blockBuilder
        .foreground("colors_normal_dark")
        .background("colors_normal_blue")
        .bold()
        .create()

    const leftBlock2 = blockBuilder
        .foreground("colors_normal_dark")
        .background("colors_normal_blue")
        .bold()
        .create()

    console.log(leftBlock1, leftBlock2)

    if (args.find((el) => el === "--noEmit")) return

    await buildFromConfiguration(constants.CONFIG_PATH)

    tmuxPropsBuilder
        .setProperty(STATUS_BG, "colors_dim_black")
        .setProperty(STATUS_FG, "colors_normal_muted")
        .setProperty(DISPLAY_PANES_COLOR, "colors_panes_background")
        .setProperty(DISPLAY_PANES_ACTIVE_COLOR, "colors_panes_foreground")
        .setProperty(STATUS_LEFT)
        .buildStyles()
}

main()
