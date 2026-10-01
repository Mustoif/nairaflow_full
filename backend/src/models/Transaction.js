const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['funding', 'transfer'], required: true },
  direction: { type: String, enum: ['incoming', 'outgoing'], required: true },
  amount: { type: Number, required: true, min: 0.01 },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['completed', 'pending', 'failed'], default: 'completed' },
  description: { type: String, required: true, trim: true },
  reference: { type: String, required: true, unique: true },
  recipient: { type: String, trim: true },
  counterparty: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true })

module.exports = mongoose.model('Transaction', transactionSchema)
