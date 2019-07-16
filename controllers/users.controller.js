var config = require('config');
var express = require('express');
var router = express.Router();
var authHelper = require('../helpers/auth-helper');
var userService = require('../services/user.service');

// routes
router.post('/create', register);
router.post('/profile/get', getProfile);
router.post('/profile/set', setProfile);
router.post('/bought', getBoughtCars);
router.post('/sold', getSoldCars);
router.post('/cars', getCars);
router.post('/reserve', getReservedCars);
router.post('/filter', getFilterCars);
router.post('/feedback/set', setFeedback);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/:_id', authHelper.checkAuth(), update);
router.delete('/:_id', authHelper.checkAuth(),  _delete);

module.exports = router;

function register(req, res) {
    userService.create(req.body)
        .then(function (user) {
            res.send(user);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getProfile(req, res) {
    userService.getProfile(req.body)
        .then(function(user){
            res.send(user);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function setProfile(req, res) {
    userService.setProfile(req.body)
        .then(function(status){
            res.send(status);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function getBoughtCars(req, res) {
    userService.getBoughtCars(req.body)
        .then(function(cars){
            res.send(cars);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function getCars(req, res) {
    userService.getCars(req.body)
        .then(function(cars){
            res.send(cars);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function getSoldCars(req, res) {
    userService.getSoldCars(req.body)
        .then(function(cars){
            res.send(cars);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function getReservedCars(req, res) {
    userService.getReservedCars(req.body)
        .then(function(cars){
            res.send(cars);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function getFilterCars(req, res) {
    userService.getFilterCars(req.body)
        .then(function(cars){
            res.send(cars);
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function setFeedback(req, res) {
    userService.setFeedback(req.body)
        .then(function(){
            res.send({status: 'OK'});
        })
        .catch(function(err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    userService.getAll()
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    userService.getById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    userService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    userService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}
