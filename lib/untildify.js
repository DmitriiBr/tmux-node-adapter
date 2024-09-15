const Os = require("node:os")

const HOME_DIRECTORY = Os.homedir()

const untildify = (pathWithTilde) => {
    const path = HOME_DIRECTORY + pathWithTilde.slice(1).replace(/\\/g, "/")

    return path
}

module.exports = untildify
