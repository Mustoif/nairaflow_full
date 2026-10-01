const router = require('express').Router()
const { register, login, forgotPassword } = require('../controllers/auth.controller')

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)

module.exports = router
