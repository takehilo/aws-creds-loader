import fs from 'fs'
import os from 'os'
import path from 'path'

import createDebug from 'debug'
import ini from 'ini'

const debug = createDebug('aws-creds-loader')

export default function (AWS, opts = {}) {
  const profile = opts.profile || 'default'
  const credsFile = opts.credentialsFile || getDefaultCredentialsFile()
  const configFile = opts.configFile || getDefaultConfigFile()
  loadCredentials(AWS, profile, credsFile)
  loadRegion(AWS, profile, configFile)
}

function loadCredentials (AWS, profile, filename) {
  const chain = new AWS.CredentialProviderChain([
    () => new AWS.EnvironmentCredentials('AWS'),
    () => new AWS.SharedIniFileCredentials({profile, filename})
  ])
  chain.resolve((err, credentials) => {
    if (err) {
      debug(err)
    }
    AWS.config.credentials = credentials
  })
}

function loadRegion (AWS, profile, filename) {
  if (process.env.AWS_DEFAULT_REGION) {
    AWS.config.update({region: process.env.AWS_DEFAULT_REGION})
    return
  }

  try {
    const config = ini.parse(fs.readFileSync(filename, 'utf-8'))
    const region = config[profile === 'default' ? profile : `profile ${profile}`].region
    AWS.config.update({region})
  } catch (err) {
    debug(err)
  }
}

function getDefaultCredentialsFile () {
  return path.join(os.homedir(), '.aws', 'credentials')
}

function getDefaultConfigFile () {
  return path.join(os.homedir(), '.aws', 'config')
}
