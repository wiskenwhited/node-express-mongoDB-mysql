let express = require('express');
let router = express.Router();
const brandService = require('services/brand.service');

const getAll = (req, res) => {
    brandService.getAll()
        .then(users => res.send(users))
        .catch(err => res.status(400).send(err));
}

// routes
router.get('/', getAll);

module.exports = router;
