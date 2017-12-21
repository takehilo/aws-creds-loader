import path from 'path'

import AWS from 'aws-sdk'

import awsCredsLoader from '../../src'
import {resetEnv, getFixtureDir} from '../helpers'

describe('aws-creds-loader', function () {
  beforeEach(function () {
    resetEnv()
    process.env.HOME = getFixtureDir()
    AWS.config = new AWS.Config()
  })

  it('loads "default" profile', function () {
    awsCredsLoader(AWS)
    expect(AWS.config.credentials.accessKeyId).to.equal('DEFAULT_ACCESS_KEY_ID')
    expect(AWS.config.credentials.secretAccessKey).to.equal('DEFAULT_SECRET_ACCESS_KEY')
    expect(AWS.config.region).to.equal('ap-northeast-1')
  })

  it('loads "admin" profile', function () {
    awsCredsLoader(AWS, {profile: 'admin'})
    expect(AWS.config.credentials.accessKeyId).to.equal('ADMIN_ACCESS_KEY_ID')
    expect(AWS.config.credentials.secretAccessKey).to.equal('ADMIN_SECRET_ACCESS_KEY')
    expect(AWS.config.region).to.equal('us-east-1')
  })

  it('loads "default" profile from the specified files', function () {
    awsCredsLoader(AWS, {
      credentialsFile: path.join(getFixtureDir(), 'credentials'),
      configFile: path.join(getFixtureDir(), 'config')
    })
    expect(AWS.config.credentials.accessKeyId).to.equal('USER_ACCESS_KEY_ID')
    expect(AWS.config.credentials.secretAccessKey).to.equal('USER_SECRET_ACCESS_KEY')
    expect(AWS.config.region).to.equal('eu-west-1')
  })

  it('does not set config when the specified profile name is not found', function () {
    awsCredsLoader(AWS, {profile: 'invalid'})
    expect(AWS.config.credentials).to.be.null
    expect(AWS.config.region).to.be.undefined
  })

  it('does not set credentials if it fails to load credentials', function () {
    class FakeCredentialProviderChain {
      resolve (cb) {
        cb(new Error(), null)
      }
    }

    this.sinon.stub(AWS, 'CredentialProviderChain')
      .callsFake(() => new FakeCredentialProviderChain())

    awsCredsLoader(AWS)
    expect(AWS.config.credentials).to.be.null
    expect(AWS.config.region).to.equal('ap-northeast-1')
  })

  describe('when environment variables are set', function () {
    beforeEach(function () {
      process.env.AWS_DEFAULT_REGION = 'us-west-1'
      process.env.AWS_ACCESS_KEY_ID = 'ENV_ACCESS_KEY_ID'
      process.env.AWS_SECRET_ACCESS_KEY = 'ENV_SECRET_ACCESS_KEY'
    })

    it('loads credentials and region from the environment variables', function () {
      awsCredsLoader(AWS)
      expect(AWS.config.credentials.accessKeyId).to.equal('ENV_ACCESS_KEY_ID')
      expect(AWS.config.credentials.secretAccessKey).to.equal('ENV_SECRET_ACCESS_KEY')
      expect(AWS.config.region).to.equal('us-west-1')
    })
  })
})
