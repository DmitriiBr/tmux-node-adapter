const Fs = require("node:fs/promises")

const {
    appendLineToFile,
    constants,
    untildify,
} = require("@tmux-node-adapter/lib")

const createVariable = (key, value, buildPath) => {
    const content = `${key}="${value}"${constants.NEW_LINE}`
    appendLineToFile(content, buildPath)
}

const recursivelyAppendAttributes = ({ node, attr, buildPath }) => {
    if (typeof node === "string" && attr) {
        const key = attr.slice(0, -1)

        createVariable(key, node, buildPath)

        return
    }

    for (const key in node) {
        const nextAttr = attr ? attr + key : key

        recursivelyAppendAttributes({
            node: node[key],
            attr: nextAttr + constants.UNDERSCORE,
            buildPath,
        })
    }
}

const buildFromConfiguration = async (configPath, buildPath) => {
    try {
        const path = untildify(configPath)
        const data = await Fs.readFile(path, { encoding: "utf8" })
        const jsonTmuxConfig = JSON.parse(data)

        recursivelyAppendAttributes({ node: jsonTmuxConfig, buildPath })
    } catch (err) {
        throw new Error(err)
    }
}

module.exports = buildFromConfiguration
