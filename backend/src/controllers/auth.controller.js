const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const generateAccountNumber = require('../utils/accountNumber')

function splitName(fullName) {
  const parts = fullName.trim().split(/\s+/)
  return { firstName: parts[0] || '', lastName: parts.slice(1).join(' ') || '' }
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    accountNumber: user.accountNumber,
  }
}

function signToken(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

async function register(req, res, next) {
  try {
    const { fullName, email, password } = req.body
    if (!fullName?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ message: 'Full name, email and password are required.' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' })
    }

    const normalizedEmail = email.trim().toLowerCase()
    const exists = await User.exists({ email: normalizedEmail })
    if (exists) return res.status(409).json({ message: 'An account with this email already exists.' })

    const { firstName, lastName } = splitName(fullName)
    if (!lastName) return res.status(400).json({ message: 'Enter both first and last name.' })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({
      fullName: `${firstName} ${lastName}`,
      firstName,
      lastName,
      email: normalizedEmail,
      passwordHash,
      accountNumber: await generateAccountNumber(),
      balance: 0,
    })

    res.status(201).json({ user: publicUser(user), token: signToken(user) })
  } catch (error) {
    next(error)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email?.trim() || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash')
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    res.json({ user: publicUser(user), token: signToken(user) })
  } catch (error) {
    next(error)
  }
}

async function forgotPassword(req, res, next) {
  try {
    const email = req.body.email?.trim().toLowerCase()
    if (!email) return res.status(400).json({ message: 'Email address is required.' })

    // Deliberately generic so account existence is not disclosed.
    // An email provider can be connected here later to deliver a reset link.
    await User.exists({ email })
    res.json({ message: 'If an account exists for this email, password reset instructions will be sent.' })
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, forgotPassword, publicUser }
