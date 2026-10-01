const router = require('express').Router()
const auth = require('../middleware/auth')
const { getWallet, fundWallet } = require('../controllers/wallet.controller')

router.get('/', auth, getWallet)
router.post('/fund', auth, fundWallet)

module.exports = router
