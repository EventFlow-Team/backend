const router = require('express').Router()
const usersRouter = require('./users');
const companiesRouter = require('./companies')

router.use('/', usersRouter);
router.use('/', companiesRouter);

module.exports = router;