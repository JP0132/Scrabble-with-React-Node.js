const express = require('express'),
router = express.Router(),
calcMove = require('../controllers/calculateMove')

router.post('/', calcMove.calculateMove)

module.exports = router;