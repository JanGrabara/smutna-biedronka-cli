#!/usr/bin/env node
const program = require('commander');
const { prompt } = require('inquirer');
const request = require('request')
const { dirAdress, staticAdress } = require('./staticConfig')
const { getBufferAndApiKey } = require('./zip')


program
  .command('zipapp [otherDirs...]')
  .action(async (otherDirs) => {

    let buffer, apiKey

    try {
      let obj  = await getBufferAndApiKey(otherDirs)
      buffer = obj.buffer
      apiKey = obj.apiKey
    } catch (err) {
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

program
  .command('zipstatic [otherDirs...]')
  .action(async otherDirs => {

    let buffer, apiKey

    try {
      let obj  = await getBufferAndApiKey(otherDirs)
      buffer = obj.buffer
      apiKey = obj.apiKey
    } catch (err) {
      console.error(err)
      process.exit()
    }

    const r = request.post(staticAdress, function (err, httpResponse, body) {
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







