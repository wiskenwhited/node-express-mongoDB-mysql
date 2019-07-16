var config = require('config');
var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth-helper');
var areaService = require('services/test-items.service');

// routes
router.post('/create', authHelper.checkAuth(), register);
router.get('/', getAll);
router.put('/:_id', authHelper.checkAuth(), update);
router.delete('/:_id', authHelper.checkAuth(), _delete);

module.exports = router;

function register(req, res) {
    areaService.create(req.body)
        .then(function (item) {
            res.send(item);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    areaService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    areaService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    areaService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}