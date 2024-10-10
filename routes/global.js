const router = require('express').Router();
const globalController = require('../controllers/globalController');
const eventController = require('../controllers/eventController');

// Rotas de autenticação
router.route('/auth/login').post((req, res) => globalController.login(req, res));

// Rotas de eventos
router.route('/event').get((req, res) => eventController.events(req, res));
router.route('/event/rating/:eventId').put((req, res) => eventController.eventRating(req, res));

module.exports = router;


