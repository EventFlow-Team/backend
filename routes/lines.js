const router = require('express').Router();
const lineController = require('../controllers/lineController');
const authMiddleware = require('../middlewares/auth');

router.route('/:id').post(authMiddleware, (req, res) => lineController.create(req, res));
router.route('/stand/:id').get(authMiddleware, (req, res) => lineController.standLines(req, res));
router.route('/user').get(authMiddleware, (req, res) => lineController.userLines(req, res));
router.route('/add_user/:id').put(authMiddleware, (req, res) => lineController.addUser(req, res));
router.route('/remove_user/:id').put(authMiddleware, (req, res) => lineController.removeUser(req, res));

module.exports = router;


