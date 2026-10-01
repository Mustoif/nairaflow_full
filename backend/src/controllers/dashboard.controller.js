const Transaction = require('../models/Transaction')
const { mapTransaction } = require('./wallet.controller')

async function getDashboard(req, res, next) {
  try {
    const includeTransactions = req.query.includeTransactions !== 'false'
    const transactions = includeTransactions
      ? await Transaction.find({ user: req.user._id }).sort({ date: -1 }).limit(5)
      : []

    res.json({
      availableBalance: req.user.balance,
      transactions: transactions.map((t) => ({
        ...mapTransaction(t),
        type: t.type === 'funding' ? 'wallet-funding' : (t.direction === 'incoming' ? 'transfer-received' : 'transfer-sent'),
      })),
    })
  } catch (error) {
    next(error)
  }
}

module.exports = { getDashboard }
