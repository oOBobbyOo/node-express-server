const monoose = require('mongoose')
const Schema = monoose.Schema

// Create Schema
const ProfileSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  describe: {
    type: String
  },
  income: {
    type: String,
    required: true
  },
  expend: {
    type: String,
    required: true
  },
  cash: {
    type: String,
    required: true
  },
  remark: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = Profile = monoose.model('profiles', ProfileSchema)