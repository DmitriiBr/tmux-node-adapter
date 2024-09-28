const buildFromConfiguration = require("./src/buildFromConfiguration")

const TmuxBlockBuilder = require("./src/TmuxBlockBuilder")
const TmuxPropsBuilder = require("./src/TmuxPropsBuilder")

const { constants, appendLineToFile } = require("@tmux-node-adapter/lib")

const {
    DISPLAY_PANES_ACTIVE_COLOR,
    DISPLAY_PANES_COLOR,
    STATUS_LEFT,
    STATUS_FG,
    STATUS_BG,
} = constants.TMUX

const main = async () => {
    const args = process.argv

    const buildPath = "./build.tmux"

    const tmuxPropsBuilder = new TmuxPropsBuilder(buildPath)
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

    if (args.find((el) => el === "--noEmit")) return

    await buildFromConfiguration(constants.CONFIG_PATH, "./build.tmux")

    tmuxPropsBuilder
        .setProperty(STATUS_BG, "colors_dim_black")
        .setProperty(STATUS_FG, "colors_normal_muted")
        .setProperty(DISPLAY_PANES_COLOR, "colors_panes_left_background")
        .setProperty(DISPLAY_PANES_ACTIVE_COLOR, "colors_panes_left_foreground")
        .setProperty(STATUS_LEFT)
        .buildStyles()
}

main()
