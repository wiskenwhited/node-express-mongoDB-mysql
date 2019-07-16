const express = require('express');
const router = express.Router();
const pushService = require('../services/push.service');

const register = (req, res) => {
    pushService.addFilter(req.body).then(() => {
        pushService.pushFilterMessage();
        res.status(200).send('OK');
    }).catch(err => {
        res.status(400).send(err); 
    });
}

router.post('/create', register);

module.exports = router;