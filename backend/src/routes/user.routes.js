const router = require('express').Router()
const auth = require('../middleware/auth')
const { me, updateProfile } = require('../controllers/user.controller')

router.get('/me', auth, me)
router.patch('/me', auth, updateProfile)

module.exports = router
