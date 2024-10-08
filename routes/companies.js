const router = require('express').Router();
const companyController = require('../controllers/companyController');
const eventController = require('../controllers/eventController');
const standController = require('../controllers/standController');
const authMiddleware = require('../middlewares/auth');

// rotas de autenticação
router.route('/auth/register').post((req, res) => companyController.create(req, res));
router.route('/auth/login').post((req, res) => companyController.login(req, res));           

// rotas da empresa
router.route('/').get(authMiddleware, (req, res) => companyController.company(req, res));        

// rotas de eventos
router.route('/event').post(authMiddleware, (req, res) => eventController.create(req, res));
router.route('/event').get(authMiddleware, (req, res) => eventController.events(req, res));
router.route('/event/rating/:id').put(authMiddleware, (req, res) => eventController.eventRating(req, res));

// rotas de stands
router.route('/stand').post(authMiddleware, (req, res) => standController.create(req, res));
router.route('/stand').get(authMiddleware, (req, res) => standController.stands(req, res));

module.exports = router;


