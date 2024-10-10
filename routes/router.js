const router = require('express').Router()
const usersRouter = require('./users');
const companiesRouter = require('./companies')
const globalRoter = require('./global')

router.use('/', globalRoter);
router.use('/user', usersRouter);
router.use('/company', companiesRouter);

module.exports = router;