const buildFromConfiguration = require("./src/buildFromConfiguration")

const TmuxBlockBuilder = require("./src/TmuxBlockBuilder")
const TmuxPropsBuilder = require("./src/TmuxPropsBuilder")

const { constants } = require("@tmux-node-adapter/lib")

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
    const shouldCreateBuildFile = !args.find((el) => el === "--noEmit")

    const tmuxPropsBuilder = new TmuxPropsBuilder({ buildPath, debug: true })
    const tmuxBlockBuilder = new TmuxBlockBuilder()

    const statusLeft = tmuxBlockBuilder
        .foreground("${colors_normal_dark}")
        .background("${colors_normal_blue}")
        .bold()
        .create()

    const leftBlock2 = tmuxBlockBuilder
        .foreground("${colors_normal_dark}")
        .background("${colors_normal_blue}")
        .bold()
        .create()

    if (shouldCreateBuildFile) {
        await buildFromConfiguration(constants.CONFIG_PATH, buildPath)
    }

    tmuxPropsBuilder
        .setProperty(STATUS_BG, "${colors_dim_black}")
        .setProperty(STATUS_FG, "${colors_normal_muted}")
        .setProperty(DISPLAY_PANES_COLOR, "${colors_panes_left_background}")
        .setProperty(
            DISPLAY_PANES_ACTIVE_COLOR,
            "${colors_panes_left_foreground}",
        )
        .setProperty(STATUS_LEFT, statusLeft)
        .build()
}

main()
