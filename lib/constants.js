const UNDERSCORE = "_"
const NEW_LINE = "\n"

const BUILD_PATH = "~/.config/tmux/build.tmux"
const CONFIG_PATH = "~/.config/tmux/tmux.conf.json"

const TMUX = {
    SET_GLOBAL: "set -g",
    STATUS_BG: "status-bg",
    STATUS_FG: "status-fg",
    STATUS_LEFT: "status-left",
    DISPLAY_PANES_COLOR: "display-panes-colour",
    DISPLAY_PANES_ACTIVE_COLOR: "display-panes-active-colour",
}

module.exports = {
    UNDERSCORE,
    NEW_LINE,
    BUILD_PATH,
    CONFIG_PATH,
    TMUX,
}
