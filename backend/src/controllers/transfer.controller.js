const mongoose = require('mongoose')
const User = require('../models/User')
const Transaction = require('../models/Transaction')
const makeReference = require('../utils/reference')
const { mapTransaction } = require('./wallet.controller')

async function sendTransfer(req, res, next) {
  const amount = Number(req.body.amount)
  const recipientNumber = String(req.body.recipient || '').trim()
  const description = String(req.body.description || '').trim()

  if (!/^\d{6,15}$/.test(recipientNumber)) {
    return res.status(400).json({ message: 'Enter a valid recipient account number.' })
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Enter a transfer amount greater than ₦0.' })
  }
  if (recipientNumber === req.user.accountNumber) {
    return res.status(400).json({ message: 'You cannot transfer to your own account.' })
  }

  const session = await mongoose.startSession()
  try {
    let sender
    let recipient

    await session.withTransaction(async () => {
      sender = await User.findOneAndUpdate(
        { _id: req.user._id, balance: { $gte: amount } },
        { $inc: { balance: -amount } },
        { new: true, session },
      )
      if (!sender) {
        const exists = await User.exists({ _id: req.user._id })
        if (!exists) throw Object.assign(new Error('User account not found.'), { status: 404 })
        throw Object.assign(new Error('This amount is more than your available balance.'), { status: 400 })
      }

      recipient = await User.findOneAndUpdate(
        { accountNumber: recipientNumber },
        { $inc: { balance: amount } },
        { new: true, session },
      )
      if (!recipient) throw Object.assign(new Error('Recipient account was not found.'), { status: 404 })

      await Transaction.create([{
        user: sender._id,
        type: 'transfer',
        direction: 'outgoing',
        amount,
        status: 'completed',
        description: description || `Transfer to ${recipientNumber}`,
        reference: makeReference('TRF'),
        recipient: recipientNumber,
        counterparty: recipient._id,
      }], { session })

      await Transaction.create([{
        user: recipient._id,
        type: 'transfer',
        direction: 'incoming',
        amount,
        status: 'completed',
        description: description || `Transfer from ${sender.accountNumber}`,
        reference: makeReference('TRF'),
        recipient: sender.accountNumber,
        counterparty: sender._id,
      }], { session })
    })

    const transactions = await Transaction.find({ user: sender._id }).sort({ date: -1 }).limit(100)
    res.json({ availableBalance: sender.balance, transactions: transactions.map(mapTransaction) })
  } catch (error) {
    next(error)
  } finally {
    await session.endSession()
  }
}

module.exports = { sendTransfer }
