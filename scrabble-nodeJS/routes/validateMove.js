const express = require('express'),
router = express.Router(),
valMove = require('../controllers/validateMove')
router.post('/', valMove.validateMove);

module.exports = router;