const express = require('express')
// const path = require('path')
require("dotenv").config()
const cors = require("cors")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// routes
const userRoutes = require('./routes/User')
const idnAreaRoutes = require('./routes/Area')

// app
var app = express()

const corsOptions = {
  origin: 'http://localhost:8080'
}

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/api', (req, res) => {
  res.json({
    title: 'Digger API',
    version: '1.0',
    endpoints: [
      {
        "/user" : 'API for App users',
        "/idn-area" : 'API for Indonesian Area'
      }
    ]})
})

// Route
// user
app.use('/api/user', userRoutes)
// idn-area
app.use('/api/idn-area', idnAreaRoutes)

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`)
})