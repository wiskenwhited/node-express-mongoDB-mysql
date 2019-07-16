var config = require('config');
var Q = require('q');
var http = require('http');
var qs = require('querystring');

var service = {};

service.sendTokenMsg = sendTokenMsg;

module.exports = service;

function sendTokenMsg(phonenum, token) {
  var msg = '您的验证码是' + token + '。如非本人操作，请忽略。';
  console.log('-----------------------------------------')
  console.log(token);
  return sendMsg(phonenum, msg);
};

function sendMsg(phonenum, msg) {
  var url = 'http://' + config.sms.url + '/?';
  var params = {
    'Uid': config.sms.Uid,
    'Key': config.sms.Key,
    'smsMob': phonenum,
    'smsText': msg
  };
  url += qs.stringify(params);
  var deferred = Q.defer();
  http.get(url, function(res) {
    var body = '';
    res.on('data', function(data) {
      body += data;
    });
    res.on('end', function() {
      deferred.resolve(body);
    });
  }).on('error', function(e) {
    deferred.reject(e.message);
  });
  return deferred.promise;
};
