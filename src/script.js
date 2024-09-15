const buildFromConfiguration = require("./buildFromConfiguration")

const { constants, appendLineToFile } = require("@tmux-node-adapter/lib")

const SET_GLOBAL = "set -g"
const STATUS_BG = "status-bg"
const STATUS_FG = "status-fg"
const DISPLAY_PANES_COLOR = "display-panes-colour"
const DISPLAY_PANES_ACTIVE_COLOR = "display-panes-active-colour"

class TmuxStylesBuilder {
    #tmuxStyles = new Map([
        [STATUS_BG, ""],
        [STATUS_FG, ""],
        [DISPLAY_PANES_COLOR, ""],
        [DISPLAY_PANES_ACTIVE_COLOR, ""],
    ])

    constructor(buildPath) {
        this.buildPath = buildPath || constants.BUILD_PATH
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

class TmuxStatusBlock {
    static block = ""
    static uniqueMethodsMap = new Map()
    #reset = "nobold,noitalics,nounderscore"

    foreground(color) {
        if (TmuxStatusBlock.uniqueMethodsMap.has("foreground"))
            throw new TypeError("Foreground was already declared")

        TmuxStatusBlock.block + `fg=${color},`
        TmuxStatusBlock.uniqueMethodsMap.set("foreground", true)

        return this
    }
    background(color) {
        if (TmuxStatusBlock.uniqueMethodsMap.has("background"))
            throw new TypeError("Background was already declared")

        TmuxStatusBlock.block + `bg=${color},`
        TmuxStatusBlock.uniqueMethodsMap.set("background", true)

        return this
    }

    create() {
        return `#[${TmuxStatusBlock.block}${this.#reset}]`
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
    await buildFromConfiguration(constants.CONFIG_PATH)

    const tmuxStyles = new TmuxStylesBuilder(constants.BUILD_PATH)

    tmuxStyles
        .setProperty(STATUS_BG, "colors_dim_black")
        .setProperty(STATUS_FG, "colors_normal_muted")
        .setProperty(DISPLAY_PANES_COLOR, "colors_panes_background")
        .setProperty(DISPLAY_PANES_ACTIVE_COLOR, "colors_panes_foreground")
        .buildStyles()
}

main()
