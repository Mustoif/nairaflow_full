const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  accountNumber: { type: String, required: true, unique: true, index: true },
  balance: { type: Number, default: 0, min: 0 },
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
