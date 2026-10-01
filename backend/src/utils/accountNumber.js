const User = require('../models/User')

async function generateAccountNumber() {
  for (let i = 0; i < 20; i += 1) {
    const number = String(Math.floor(1000000000 + Math.random() * 9000000000))
    const exists = await User.exists({ accountNumber: number })
    if (!exists) return number
  }
  throw new Error('Unable to generate a unique account number.')
}

module.exports = generateAccountNumber
