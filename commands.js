#!/usr/bin/env node
const program = require('commander');
const { prompt } = require('inquirer');
const request = require('request')
const { getBufferAndApiKey } = require('./zip')


program
  .command('zipapp [otherDirs...]')
  .action(async (otherDirs) => {

    let buffer, apiKey, uploadUrl

    try {
      const { bufferr, config } = await getBufferAndApiKey(otherDirs)
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
  .command('zipstatic [otherDirs...]')
  .action(async otherDirs => {

    let buffer, apiKey, uploadUrl

    try {
      const { bufferr, config } = await getBufferAndApiKey(otherDirs)
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







