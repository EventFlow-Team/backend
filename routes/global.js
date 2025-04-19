const router = require('express').Router();
const globalController = require('../controllers/globalController');

// Rotas de autenticação
router.route('/auth/login').post((req, res) => globalController.login(req, res));

module.exports = router;


