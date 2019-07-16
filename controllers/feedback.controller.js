const express = require('express');
const router = express.Router();
const authHelper = require('../helpers/auth-helper');
const service = require('services/feedback.service');

function getAll(req, res) {
    service.getAll()
        .then(function (feedbacks) {
            res.send(feedbacks);
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

// routes
router.get('/', getAll);
router.delete('/:_id', authHelper.checkAuth(),  _delete);
module.exports = router;
