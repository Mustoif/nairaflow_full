const crypto = require('crypto')

function makeReference(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`
}

module.exports = makeReference
