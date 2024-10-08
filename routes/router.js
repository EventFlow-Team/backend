const router = require('express').Router()
const usersRouter = require('./users');
const companiesRouter = require('./companies')

router.use('/user', usersRouter);
router.use('/company', companiesRouter);

module.exports = router;