var config = require('config');
var express = require('express');
var router = express.Router();
var errorHelper = require('../helpers/error-helper');
var authHelper = require('../helpers/auth-helper');
var managerService = require('../services/manager.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.post('/add', authHelper.checkAuth(), addManager);
router.post('/edit', authHelper.checkAuth(), editManager);
router.get('/logout', authHelper.checkAuth(), logout);
router.get('/', authHelper.checkAuth(), getAll);
router.get('/current', getCurrent);
router.delete('/:_id', authHelper.checkAuth(), _delete);

module.exports = router;

function authenticate(req, res) {
    managerService.authenticate(req.body.username, req.body.password)
        .then(function (user) {
            if (user) {
                // authentication successful
                req.user = authHelper.serializeUser(user);
                var token = authHelper.generateToken(req.user);

                // authHelper.setTokenCookie(res, token);

                user.token = token;
                res.send(user);
            } else {
                // authentication failed
                errorHelper.handleError(res, 'Incorrect username or password', 400);
            }
        })
        .catch(function (err) {
            errorHelper.handleError(res, err);
        });
}

// Logout api is needed when using JWT cookie
function logout(req, res) {
  res.clearCookie(config.jwt.cookieName);

  return res.json(req.user);
}

function register(req, res) {
    managerService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function addManager(req, res) {
    managerService.addManager(req.user, req.body)
        .then(function (data) {
            res.send(data);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function editManager(req, res) {
    managerService.editManager(req.user, req.body)
        .then(function (data) {
            res.send(data);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    managerService.getAll(req.user)
        .then(function (users) {
            res.send(users);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    managerService.getById(req.user._id)
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

function _delete(req, res) {
    managerService.delete(req.user, req.params._id)
        .then(function (data) {
            res.send(data);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}