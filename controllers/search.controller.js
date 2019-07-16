var config = require('config');
var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth-helper');
var service = require('../services/search.service');

// routes
router.get('/', get);
router.post('/', post);

module.exports = router;

function get(req, res) {
    service.get(req.query)
        .then(function (data) {
            res.send(data);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function post(req, res) {
    service.get(req.body)
        .then(function (data) {
            res.send(data);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}