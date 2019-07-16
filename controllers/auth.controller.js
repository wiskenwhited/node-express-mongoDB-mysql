var express = require('express');
var speakeasy = require('speakeasy');
var router = express.Router();
var userService = require('services/user.service');
var smsService = require('services/sms.service');

router.post('/login', login);
router.post('/verify', verify);

module.exports = router;

function login(req, res) {
  var secret = speakeasy.generateSecret({length: 20});
  var token = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32'
  });
  userService.saveToken(req.body.num, secret.base32).then(function() {
    smsService.sendTokenMsg(req.body.num, token).then(function(resp) {
      if (resp === '1') {
        res.send({status: 'OK'});
      } else {
        res.send({status: 'Failed'});
      }
    }).catch(function(err) {
      res.status(400).send(err);
    });
  }).catch(function(err) {
    res.status(400).send(err);
  });
};

function verify(req, res) {
  var phonenum = req.body.num;
  var token = req.body.code;
  var osType = req.body.os;
  var identifier = req.body.identifier;
  userService.getToken(phonenum).then(function(user) {
    if (user) {
      var isValid = speakeasy.totp.verify({
        secret: user.secret,
        encoding: 'base32',
        token: token,
        window: 600
      });
      if (isValid) {
        userService.setVerified(user, osType, identifier).then(function() {
          res.send({status: 'OK'});
        }).catch(function(err) {
          res.status(400).send(err);
        });
      } else {
        res.send({status: 'Failed to verify'});
      }
    } else {
      res.send({status: 'Not registered'});
    }
  }).catch(function(err) {
    res.status(400).send(err);
  });
};
