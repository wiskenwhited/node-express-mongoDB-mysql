let express = require('express');
let router = express.Router();
const areaService = require('services/areas.service');

const getAll = (req, res) => {
    areaService.getAll()
        .then(users => res.send(users))
        .catch(err => res.status(400).send(err));
}

// routes
router.get('/', getAll);

module.exports = router;
