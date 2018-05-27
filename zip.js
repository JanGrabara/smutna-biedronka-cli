const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const zipdir = require('zip-dir')
const zipdirAsync = promisify(zipdir)

async function getBufferAndApiKey(otherDirs, staticConfigCmdPath) {

    const filePath = getFilePath(otherDirs)
    const configPath = getStaticConfigPath(filePath, staticConfigCmdPath)
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

function getFilePath(otherDirs) {
    const dir = otherDirs[0] ? otherDirs[0].toString() : ''
    return path.join(process.cwd(), dir)
}

function getStaticConfigPath(filePath, staticConfigCmdPath) {
    return staticConfigCmdPath ?
        path.join(process.cwd(), "biedronka.config.json") :
        path.join(filePath, "biedronka.config.json")
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