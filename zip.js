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

    const apiKey = getApiKey(configPath)
    if (!apiKey) {
        throw "No api-key provided"
    }
    const buffer = await zipdirAsync(filePath, { filter: filertNode_modules })
    return {buffer,apiKey}
}

module.exports.getBufferAndApiKey = getBufferAndApiKey

function getPaths(otherDirs) {

    const dir = otherDirs[0] ? otherDirs[0].toString() : ''
    const filePath = path.join(process.cwd(), dir)
    const configPath = path.join(filePath, "staticConfig.json")

    return { filePath, configPath }
}

function getApiKey(configPath) {
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
        if (config.apiKey) {
            return config.apiKey
        }
    }
    return null
}

function filertNode_modules(path, stat) {
    return !path.endsWith('node_modules')
}