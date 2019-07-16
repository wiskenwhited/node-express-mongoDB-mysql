var config = require('config');
var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth-helper');
var service = require('../services/test.service');

const post = (req, res) => {
    service.getTestResult(req.body.id)
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(400).send(err);
        })
}

// routes
router.post('/', post);

module.exports = router;