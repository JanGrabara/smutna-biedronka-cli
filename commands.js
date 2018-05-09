#!/usr/bin/env node
const program = require('commander');
const { prompt } = require('inquirer');
const zipdir = require('zip-dir')
const request = require('request')
const fs = require('fs')
const path = require('path')
const { dirAdress } = require('./staticConfig')

const filertNode_modules = (path, stat) =>
  !path.endsWith('node_modules')

function getApiKey(configPath) {
  if (fs.existsSync(configPath)) {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
    if (config.apiKey) {
      return config.apiKey
    }
  }
  return null
}

program
  .command('zip <dir>')
  .action(async (dir, cmd) => {

    const filePath = path.join(process.cwd(), dir)
    const configPath = path.join(filePath, "staticConfig.json")
    
    if (fs.existsSync(filePath)) {

      const apiKey = getApiKey(configPath)

      if (!apiKey) {
        console.error("No api-key provided")
        process.exit()
      }

      zipdir(filePath, { filter: filertNode_modules }, function (err, buffer) {
        if (err) {
          console.error(err)
          process.exit()
        }

        const r = request.post(dirAdress, function (err, httpResponse, body) {
          if (err) {
            return console.error('upload failed:', err);
          }
          console.log('Upload successful!  Server responded with:', body);
          process.exit()
        });
        const form = r.form()
        form.append('file', buffer, { filename: 'zip.zip' })
        form.append('apiKey', apiKey)

      })

    } else {
      console.error('No such dir')
      process.exit()
    }
  })


program.parse(process.argv);