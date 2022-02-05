const express = require('express'),
router = express.Router(),
calcMove = require('../controllers/calculateMove')
//const bodyParser = require('body-parser');
//var urlencodedParser = bodyParser.urlencoded({ extended: false });
//var jsonParser = bodyParser.json();
router.post('/', calcMove.calculateMove);

module.exports = router;