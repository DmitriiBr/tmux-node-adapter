const Os = require("node:os")
const Path = require("node:path")

const HOME_DIRECTORY = Os.homedir()

/**
 * Util to remove tilde from param
 * @param {string} pathWithTilde
 */
const untildify = (pathWithTilde) => {
    let path = pathWithTilde

    if (pathWithTilde[0] === "~") {
        path = HOME_DIRECTORY + pathWithTilde.slice(1).replace(/\\/g, "/")
    }

    return path
}

module.exports = untildify
