const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')

const app = express()
const port = process.env.PORT || 3000

// MogonURI
const { mogonURI } = require('./config/keys')

// Users router
const users = require('./routes/api/users')
const profiles = require('./routes/api/profiles')

// Connect to MongoDB
mongoose.connect(mogonURI, { useFindAndModify: false }).then(() => {
  console.log('MongoDB Connected')
}).catch(err => {
  console.log(err)
})

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(passport.initialize());
require('./config/passport')(passport)

// route
app.use('/api/users', users)
app.use('/api/profiles', profiles)

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
})