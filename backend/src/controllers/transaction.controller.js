const Transaction = require('../models/Transaction')
const { mapTransaction } = require('./wallet.controller')

async function getTransactions(req, res, next) {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 }).limit(500)
    res.json(transactions.map(mapTransaction))
  } catch (error) {
    next(error)
  }
}

async function getTransaction(req, res, next) {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    })
    if (!transaction) return res.status(404).json({ message: 'Transaction not found.' })
    res.json(mapTransaction(transaction))
  } catch (error) {
    next(error)
  }
}

module.exports = { getTransactions, getTransaction }
