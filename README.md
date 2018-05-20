# gcf-runtime-config 

[`gcf-runtime-config`](https://www.npmjs.com/package/gcf-runtime-config) helps you run [`express`](https://expressjs.com) apps on Google Cloud Functions (GCF) without Firebase!

[![CircleCI](https://circleci.com/gh/Noless/gcf-runtime-config.svg?style=svg)](https://circleci.com/gh/Noless/gcf-runtime-config)
[![Coverage Status](https://coveralls.io/repos/github/Noless/gcf-runtime-config/badge.svg?branch=master)](https://coveralls.io/github/Noless/gcf-runtime-config?branch=master)
[![MIT License](https://img.shields.io/npm/l/gcf-runtime-config.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![version](https://img.shields.io/npm/v/gcf-runtime-config.svg?style=flat-square)](http://npm.im/gcf-runtime-config)

## Example

Edit `index.js`:

~~~js
const gcfExpressApp = require('gcf-runtime-config')
const express = require('express')

const app = express()
app.get('/', (req, res) => res.send('Yup. I\'m alive.'))

exports.testExpressApp = gcfExpressApp(app)
~~~

And then:

~~~ bash
$ gcloud beta functions deploy testExpressApp --trigger-http
~~~

Test it:
~~~ bash
$ curl https://<YOUR_PROJECT>.cloudfunctions.net/testExpressApp
~~~

Cleanup:
~~~ bash
$ gcloud beta functions delete testExpressApp
~~~

The [`example`](https://github.com/noless/gcf-runtime-config/tree/master/example)
directory is a ready-to-deploy sample function that uses
[`gcf-runtime-config`](https://www.npmjs.com/package/gcf-runtime-config) 
and deploys an express app on GCF.

## Why 

I simply wanted to run express apps on GCF without using Firebase functions.

Simply doing:

~~~js
const app = express()
[...]
exports.testExpressApp = app
~~~

Actually works. But then there's a problem with a trailing slash.

## License

MIT
