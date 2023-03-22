const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const UserModel = require('./models/User')
const jsonWebToken = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser')

// Load environment variables
dotenv.config()

const mongoUrl = process.env.MONGO_URL
const jwtSecretKey = process.env.JWT_SECRET_KEY

// Connect to MongoDB
mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    throw new Error(`Error connecting to MongoDB: ${error.message}`)
  })

const app = express()

// Use the built-in middleware for parsing request bodies
app.use(express.json())

// Use CORS middleware to allow cross-origin requests
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
)

app.get('/test', (req, res) => {
  res.json('test okay')
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body

  try {
    // Create a new user object and save it to the database
    const createdUser = new UserModel({ username, password })
    await createdUser.save()

    // Generate a JSON web token and set it as a cookie
    const token = jsonWebToken.sign({ userId: createdUser._id }, jwtSecretKey)
    res
      .cookie('token', token, { httpOnly: true })
      .status(201)
      .json({
        _id: createdUser._id,
        message: `User ${createdUser._id} created successfully`
      })
  } catch (error) {
    console.log('Error creating user', error)
    throw new Error('Internal server error')
  }
})

app.listen(4040, () => {
  console.log('Server listening on port 4040')
})
