const jwt = require('jsonwebtoken')
const User = require('../models/User')

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null

    if (!token) return res.status(401).json({ message: 'Authentication required.' })

    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(payload.sub)

    if (!user) return res.status(401).json({ message: 'User account no longer exists.' })

    req.user = user
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid or expired session. Please log in again.' })
    }
    next(error)
  }
}

module.exports = auth
