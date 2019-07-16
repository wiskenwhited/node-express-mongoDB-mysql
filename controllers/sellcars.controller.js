var config = require('config');
var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth-helper');
var service = require('../services/sellcar.service');
var pushService = require('../services/push.service');

// routes
router.get('/', getAll);

module.exports = router;

function getAll(req, res) {
    service.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

// function update(req, res) {
//   service.getById(req.params._id).then(function(car) {
//     if (req.body.price < car.price) {
//       pushService.pushDiscountMsg(req.body.uniqueId);
//     }
//     if (req.body.status === '出售完成') {
//       pushService.pushSoldMsg(req.body.uniqueId);
//     }
//     service.update(req.params._id, req.body).then(function() {
//       res.sendStatus(200);
//     }).catch(function(err) {
//       res.status(400).send(err);
//     });
//   }).catch(function(err) {
//     res.status(400).send(err);
//   });
// };
