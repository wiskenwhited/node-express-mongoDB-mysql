var config = require('config');
var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth-helper');
var service = require('services/suggestive-car.service');

// routes
router.post('/create', authHelper.checkAuth(), register);
router.get('/', getAll);
router.put('/:_id', authHelper.checkAuth(), update);
router.delete('/:_id', authHelper.checkAuth(), _delete);

module.exports = router;

function register(req, res) {
    service.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function getAll(req, res) {
    service.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    service.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    service.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}