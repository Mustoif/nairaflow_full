const router = require('express').Router()
const auth = require('../middleware/auth')
const { sendTransfer } = require('../controllers/transfer.controller')

router.post('/', auth, sendTransfer)

module.exports = router
