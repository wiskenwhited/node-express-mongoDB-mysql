var path = require('path');

var protocol = process.env.YOUCHI_PROTOCOL || 'http';
var port = process.env.YOUCHI_PORT || process.env.PORT || 4000;

module.exports = {

  protocol: protocol,
  port: port,
  host: protocol + '://' + (process.env.YOUCHI_HOSTNAME || ('127.0.0.1:' + port)),

  webConcurrency: process.env.WEB_CONCURRENCY || require('os').cpus().length,

  apiPrefix: process.env.SURFACE_OWL_API_PREFIX || '',
  apiVersion: process.env.SURFACE_OWL_API_VERSION || '',

  logLevel: process.env.YOUCHI_LOG_LEVEL || 'debug', // winston logging level

  clientAppPath: process.env.YOUCHI_CLIENT_PATH || path.resolve(__dirname, '../../../client/dist/'),
  uploadPath: path.resolve(__dirname, '../../../../upload'),

  jwt: {
    secret: process.env.YOUCHI_JWT_SECRET || 'youchiToken',
    expiresIn: 24 * 60 * 60, // 24 hours in seconds
    cookieName: process.env.YOUCHI_JWT_COOKIE_NAME || 'yc_sss'
  },

  sms: {
    provider: 'webchinese.cn',
    url: 'utf8.sms.webchinese.cn',
    Uid: 'shengbin',
    Key: 'aa46dbbfd0fe5c7ff524'
  },

  push: {
    main: 'pushy',
    baidu: {
      provider: 'push.baidu.com',
      apiKey: 'T5KMG1UMw19KGT5g0p7L9p9O',
      secretKey: '1GXGj08js6aUGMg8ckCS6wNtVLGNZt0I'
    },
    pushy: {
      provider: 'pushy.me',
      secret_api_key: '3af63f3744fca8991f48c4d5ed46dafcd7086d9f935472a186a50eaf4de8c8d5'
    }
  }
};
