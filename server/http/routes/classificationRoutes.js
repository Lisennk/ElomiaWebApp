const router = require('express').Router();

const TextClassificationController = require('../controllers/TextClassificationController');
router.route('/text/safety/classify').post((req, res) => TextClassificationController.classifySafety(req, res));

module.exports = router;