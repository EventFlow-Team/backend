const router = require('express').Router()
const usersRouter = require('./users');
const companiesRouter = require('./companies')
const eventsRouter = require('./events')
const standsRouter = require('./stands')
const linesRouter = require('./lines')
const globalRoter = require('./global')

router.use('/', globalRoter);
router.use('/user', usersRouter);
router.use('/company', companiesRouter);
router.use('/event', eventsRouter);
router.use('/stand', standsRouter);
router.use('/line', linesRouter);

module.exports = router;