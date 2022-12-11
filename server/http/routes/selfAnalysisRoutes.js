const router = require('express').Router();

const ProblemSolvingController = require('../controllers/ProblemSolvingController');
router.route('/steps/all/create').post((req, res) => ProblemSolvingController.create(req, res));
router.route('/question/personalize').post((req, res) => ProblemSolvingController.personalize(req, res));

module.exports = router;