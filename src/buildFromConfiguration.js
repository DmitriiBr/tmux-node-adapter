const Fs = require("node:fs/promises")

const {
    appendLineToFile,
    constants,
    untildify,
} = require("@tmux-node-adapter/lib")

const createVariable = (key, value) => {
    const content = `${key}="${value}"${constants.NEW_LINE}`
    appendLineToFile(content, constants.BUILD_PATH)
}

const recursivelyAppendAttributes = (node, attr) => {
    if (typeof node === "string" && attr) {
        const key = attr.slice(0, -1)

        createVariable(key, node)

        return
    }

    for (const key in node) {
        const nextAttr = attr ? attr + key : key

        recursivelyAppendAttributes(node[key], nextAttr + constants.UNDERSCORE)
    }
}

const buildFromConfiguration = async (configPath) => {
    try {
        const path = untildify(configPath)
        const data = await Fs.readFile(path, { encoding: "utf8" })
        const jsonTmuxConfig = JSON.parse(data)

        recursivelyAppendAttributes(jsonTmuxConfig)
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = buildFromConfiguration
