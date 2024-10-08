const router = require('express').Router()
const companyController = require('../controllers/companyController')
const authMiddleware = require('../middlewares/auth')

// rotas de autenticação
router.route('/company/auth/register').post((req, res) => companyController.create(req, res))
router.route('/company/auth/login').post((req, res) => companyController.login(req, res))

// rotas do usuário
router.route('/company').get(authMiddleware, (req, res) => companyController.company(req, res))

module.exports = router;


