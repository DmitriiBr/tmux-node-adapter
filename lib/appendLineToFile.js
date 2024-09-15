const Fs = require("node:fs")
const untildify = require("./untildify")

const appendLineToFile = (content, buildPath) => {
    Fs.appendFile(untildify(buildPath), content, (err) => {
        if (err) throw new Error(err)
    })
}

module.exports = appendLineToFile
