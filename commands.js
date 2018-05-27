#!/usr/bin/env node
const program = require('commander');
const { prompt } = require('inquirer');
const request = require('request')
const { getBufferAndApiKey } = require('./zip')
const fs = require('fs')

const questions = [
  {
    type: 'input',
    name: 'apiKey',
    message: 'apiKey'
  },
  {
    type: 'input',
    name: 'uploadUrl',
    message: 'uploadUrl'
  }
];

program
  .command('createconfig')
  .alias('cc')
  .description('Create biedronka.config.json')
  .action(() => {
    prompt(questions).then(answers => {
      fs.writeFileSync('biedronka.config.json', JSON.stringify(answers), 'utf8')
      process.exit()
    });
  });

program
  .command('push:app [otherDirs...]')
  .description('Arg: path to folder to zip relative to cli path, not required default get cli path')
  .option('-c, --config', 'biedronka.config.json in cli folder (default get config from zip folder)')
  .action(async (otherDirs, cmd) => {
    let buffer, apiKey, uploadUrl

    try {
      const { bufferr, config } = await getBufferAndApiKey(otherDirs, cmd.config)
      buffer = bufferr
      apiKey = config.apiKey
      uploadUrl = config.uploadUrl + "/api/Apps/AddAppFiles"
    } catch (err) {
      console.error(err)
      process.exit()
    }

    const r = request.post(uploadUrl, function (err, httpResponse, body) {
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

program
  .command('push:static [otherDirs...]')
  .description('Arg: path to folder to zip relative to cli path, not required default get cli path')
  .option('-c, --config', 'biedronka.config.json in cli folder (default get config from zip folder)')
  .action(async (otherDirs, cmd) => {

    let buffer, apiKey, uploadUrl

    try {
      const { bufferr, config } = await getBufferAndApiKey(otherDirs, cmd.config)
      buffer = bufferr
      apiKey = config.apiKey
      uploadUrl = config.uploadUrl + "/api/StaticContent/AddFiles"
    } catch (err) {
      console.error(err)
      process.exit()
    }

    const r = request.post(uploadUrl, function (err, httpResponse, body) {
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


program.parse(process.argv);







