const router = require('express').Router();
const companyController = require('../controllers/companyController');
const standController = require('../controllers/standController');
const authMiddleware = require('../middlewares/auth');

// rotas de autenticação
router.route('/auth/register').post((req, res) => companyController.create(req, res));

// rotas da empresa
router.route('/').get(authMiddleware, (req, res) => companyController.company(req, res));        
router.route('/:id').get(authMiddleware, (req, res) => companyController.companyById(req, res));

module.exports = router;


