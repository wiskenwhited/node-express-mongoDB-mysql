let express = require('express');
let router = express.Router();
const authHelper = require('../helpers/auth-helper');
const service = require('../services/buyer-request.service');
const pushService = require('../services/push.service');

const register = (req, res) => {
  service.create(req.body)
    .then(() => {
      if(req.body.requestType === '看车预约') {
        pushService.addPrice(req.body)
          .then(() => res.sendStatus(200))
          .catch(err => res.status(400).send(err));
      } else {
        res.status(200).send('OK');
      }
    })
    .catch(err => res.status(400).send(err));
}

const getAll = (req, res) => {
    service.getAll()
        .then(users => res.send(users))
        .catch(err => res.status(400).send(err));
}

const update = (req, res) => {
  service.update(req.params._id, req.body)
    .then(() => {
      pushService.add(req.body).then(() => res.sendStatus(200))
      .catch(err => res.status(400).send(err));
      res.sendStatus(200);
    })
    .catch(err => res.status(400).send(err));
}

const _delete = (req, res) => {
  service.getById(req.params._id).then(request => {
    pushService.remove(request).then(() => {
      service.delete(req.params._id).then(() => res.sendStatus(200))
      .catch(err => res.status(400).send(err));
    }).catch(() => res.status(400).send(err));
  }).catch(err => res.status(400).send(err));
}

// routes
router.post('/create', register);
router.get('/', getAll);
router.put('/:_id', authHelper.checkAuth(), update);
router.delete('/:_id', authHelper.checkAuth(), _delete);

module.exports = router;
