const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const zipdir = require('zip-dir')
const zipdirAsync = promisify(zipdir)

async function getBufferAndApiKey(otherDirs) {

    const { configPath, filePath } = getPaths(otherDirs)

    if (!fs.existsSync(filePath)) {
        throw "No such dir"
    }

    const config = getConfig(configPath)
    if (!config) {
        throw "No config provided"
    }
    const bufferr = await zipdirAsync(filePath, { filter: filertNode_modules })
    return { bufferr, config }
}

module.exports.getBufferAndApiKey = getBufferAndApiKey

function getPaths(otherDirs) {

    const dir = otherDirs[0] ? otherDirs[0].toString() : ''
    const filePath = path.join(process.cwd(), dir)
    const configPath = path.join(filePath, "staticConfig.json")

    return { filePath, configPath }
}

function getConfig(configPath) {
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
        if (config.apiKey && config.uploadUrl) {
            return config
        }
    }
    return null
}

function filertNode_modules(path, stat) {
    return !path.endsWith('node_modules')
}