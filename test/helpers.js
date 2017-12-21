import path from 'path'

import chai from 'chai'
import sinonChai from 'sinon-chai'
import 'mocha-sinon'

chai.use(sinonChai)
global.expect = chai.expect

export function resetEnv () {
  delete process.env.HOME
  delete process.env.AWS_ACCESS_KEY_ID
  delete process.env.AWS_SECRET_ACCESS_KEY
  delete process.env.AWS_PROFILE
  delete process.env.AWS_DEFAULT_REGION
  delete process.env.AWS_CONFIG_FILE
}

export function getFixtureDir () {
  return path.join(__dirname, 'fixtures')
}
