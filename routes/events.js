const router = require('express').Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middlewares/auth');

// Rotas de autenticação
router.route('/').post(authMiddleware, (req, res) => eventController.create(req, res));
router.route('/').get(authMiddleware, (req, res) => eventController.events(req, res));
router.route('/company').get(authMiddleware, (req, res) => eventController.companyEvents(req, res));
router.route('/user').get(authMiddleware, (req, res) => eventController.userEvents(req, res));
router.route('/:id').get(authMiddleware, (req, res) => eventController.eventById(req, res));
router.route('/add_user/:id').put(authMiddleware, (req, res) => eventController.addUser(req, res));
router.route('/remove_user/:id').put(authMiddleware, (req, res) => eventController.removeUser(req, res));

module.exports = router;


