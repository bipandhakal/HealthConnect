const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', require('./routes/auth'))
app.use('/api/appointments', require('./routes/appointments'))

app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Internal server error' })
})

async function seedAdmin() {
  const User = require('./models/User')
  const existing = await User.findOne({ email: 'admin@gmail.com' })
  if (!existing) {
    const hashed = await bcrypt.hash('Admin@123', 10)
    await User.create({
      name: 'Admin',
      email: 'admin@gmail.com',
      password: hashed,
      role: 'admin',
    })
    console.log('Admin account created: admin@gmail.com / Admin@123')
  }
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await seedAdmin()
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message)
    process.exit(1)
  })
