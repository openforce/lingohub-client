#!/usr/bin/env node

const args = require('args')

args
  .option('account', 'LingoHub account name')
  .option('project', 'LingoHub project ID')
  .option('token', 'LingoHub API token')
  .option('fileName', 'Upload fileName language/Download special path/{LANGUAGE_KEY}/filename{LANGUAGE_KEY} (where {LANGUAGE_KEY} is replaced by the language key)')
  .option('baseOverrideLanguage', 'Override fileName for a base language')
  .option('baseOverrideFileName', 'fileName for overridden base language')
  .option(['d', 'workingDirectory'], 'Working directory as source (upload) or target (download)')
  .command('download', 'Download files from project', (name, sub, options) => require('../src/lingohub-download')(options), ['d'])
  .command('upload', 'Upload files your static site', (name, sub, options) => require('../src/lingohub-upload')(options), ['u'])
  .example('lingohub d --account myLHAccount --project myLHProject --token [yourTOKEN] -d ./locales --fileName [FILE].json', 'Upload from ./locales')
  .example('lingohub u --account myLHAccount --project myLHProject --token [yourTOKEN] -d ./locales', 'Download from LingoHub to ./locales')

args.parse(process.argv)
