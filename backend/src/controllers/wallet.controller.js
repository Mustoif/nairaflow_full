const User = require('../models/User')
const Transaction = require('../models/Transaction')
const makeReference = require('../utils/reference')

function mapTransaction(t) {
  return {
    id: t._id.toString(),
    type: t.type,
    direction: t.direction,
    amount: t.amount,
    date: t.date.toISOString(),
    status: t.status,
    description: t.description,
    reference: t.reference,
    ...(t.recipient ? { recipient: t.recipient } : {}),
  }
}

async function getWallet(req, res, next) {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 }).limit(100)
    res.json({
      availableBalance: req.user.balance,
      transactions: transactions.map(mapTransaction),
    })
  } catch (error) {
    next(error)
  }
}

async function fundWallet(req, res, next) {
  try {
    const amount = Number(req.body.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Enter a funding amount greater than ₦0.' })
    }
    if (amount > 100000000) {
      return res.status(400).json({ message: 'Funding amount is above the allowed limit.' })
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $inc: { balance: amount } },
      { new: true },
    )

    await Transaction.create({
      user: user._id,
      type: 'funding',
      direction: 'incoming',
      amount,
      status: 'completed',
      description: 'Wallet funding',
      reference: makeReference('FUND'),
    })

    const transactions = await Transaction.find({ user: user._id }).sort({ date: -1 }).limit(100)
    res.json({ availableBalance: user.balance, transactions: transactions.map(mapTransaction) })
  } catch (error) {
    next(error)
  }
}

module.exports = { getWallet, fundWallet, mapTransaction }
