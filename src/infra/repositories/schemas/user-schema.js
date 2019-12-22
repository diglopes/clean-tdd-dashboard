const { Schema, model } = require('mongoose')

const UserSchema = new Schema(
  {
    name: {
      type: String
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    accessToken: {
      type: String
    }
  },
  {
    versionKey: false
  }
)

module.exports = model('User', UserSchema)
