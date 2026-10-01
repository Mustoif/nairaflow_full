const router = require('express').Router()
const auth = require('../middleware/auth')
const { getTransactions, getTransaction } = require('../controllers/transaction.controller')

router.get('/', auth, getTransactions)
router.get('/:id', auth, getTransaction)

module.exports = router
