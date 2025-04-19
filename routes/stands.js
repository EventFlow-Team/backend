const router = require('express').Router();
const standController = require('../controllers/standController');
const authMiddleware = require('../middlewares/auth');

router.route('/:id').post(authMiddleware, (req, res) => standController.create(req, res));
router.route('/:id').get(authMiddleware, (req, res) => standController.standById(req, res));
router.route('/:id').put(authMiddleware, (req, res) => standController.updateStand(req, res));
router.route('/company').get(authMiddleware, (req, res) => standController.companyStands(req, res));
router.route('/event/:id').get(authMiddleware, (req, res) => standController.eventStands(req, res));
router.route('/rating/:id').put(authMiddleware, (req, res) => standController.standRating(req, res));

module.exports = router;


