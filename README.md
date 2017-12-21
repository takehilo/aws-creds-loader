# aws-creds-loader
This library supports CLI apps to load credentials and region.

## Installation
```
$ npm install aws-creds-loader
```

## Usage
By default, aws-creds-loader reads `~/.aws/credentials` and `~/.aws/config` which are for [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html).

`~/.aws/credentials`

```
[default]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

[admin]
aws_access_key_id=AKIAI44QH8DHBEXAMPLE
aws_secret_access_key=je7MtGbClwBF/2Zp9Utk/h3yCo8nvbEXAMPLEKEY
```

`~/.aws/config`

```
[default]
region=ap-northeast-1

[profile admin]
region=us-east-1
```

```js
const awsCredsLoader = require('aws-creds-loader')
const AWS = require('aws-sdk')

awsCredsLoader(AWS)
AWS.config.credentials.accessKeyId      // AKIAIOSFODNN7EXAMPLE
AWS.config.credentials.secretAccessKey  // wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS.config.region                       // ap-northeast-1
```

It Supports profile option.

```js
awsCredsLoader(AWS, {profile: 'admin'})
AWS.config.credentials.accessKeyId      // AKIAI44QH8DHBEXAMPLE
AWS.config.credentials.secretAccessKey  // je7MtGbClwBF/2Zp9Utk/h3yCo8nvbEXAMPLEKEY
AWS.config.region                       // us-east-1
```

It also supports environment variables.

- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_DEFAULT_REGION

## API
### awsCredsLoader(AWS, options)
#### AWS
[`aws-sdk`](https://www.npmjs.com/package/aws-sdk) Object.

### options
#### options.profile
Profile name in your credentials/config file.

#### options.credentialsFile
Path to credentials file.
Defaults to `~/.aws/credentials`.

#### options.configFile
Path to config file.
Defaults to `~/.aws/config`.
