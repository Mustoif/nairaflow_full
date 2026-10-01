const User = require('../models/User')
const { publicUser } = require('./auth.controller')

async function me(req, res) {
  res.json(publicUser(req.user))
}

async function updateProfile(req, res, next) {
  try {
    const firstName = req.body.firstName?.trim()
    const lastName = req.body.lastName?.trim()

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required.' })
    }
    if (firstName.length < 2 || lastName.length < 2) {
      return res.status(400).json({ message: 'Names must be at least 2 characters long.' })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, fullName: `${firstName} ${lastName}` },
      { new: true, runValidators: true },
    )

    res.json(publicUser(user))
  } catch (error) {
    next(error)
  }
}

module.exports = { me, updateProfile }
