const express = require('express')
require('dotenv').config()
const app = express()
const mongoose = require('mongoose')
const createUser = require('./Routes/createUser')

const PORT = process.env.PORT

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection;
db.on('error', (error) => {
    console.error(error)
})
db.once('open', () => {
    console.log('connected to database')
})

app.use(express.json())
app.use('/createUser', createUser)



app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
