require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./src/config/db')

const authRoutes = require('./src/routes/auth.routes')
const userRoutes = require('./src/routes/user.routes')
const walletRoutes = require('./src/routes/wallet.routes')
const transferRoutes = require('./src/routes/transfer.routes')
const transactionRoutes = require('./src/routes/transaction.routes')
const dashboardRoutes = require('./src/routes/dashboard.routes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: false,
}))
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'nairaflow-backend' })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/wallet', walletRoutes)
app.use('/api/transfers', transferRoutes)
app.use('/api/transactions', transactionRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  const status = err.status || 500
  res.status(status).json({
    message: status === 500 ? 'Internal server error.' : err.message,
  })
})

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`NairaFlow API running on http://localhost:${PORT}`))
  })
  .catch((error) => {
    console.error('Database connection failed:', error.message)
    process.exit(1)
  })
