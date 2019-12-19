const { MissingParamError } = require('../../utils/errors')

class LoadUserByEmailRepo {
  constructor (UserSchema) {
    this.UserSchema = UserSchema
  }

  async load (email) {
    const user = await this.UserSchema.findOne({ email })
    if (!email) {
      throw new MissingParamError('email')
    }

    if (!user) {
      return null
    }

    return { _id: user._id, password: user.password }
  }
}

module.exports = LoadUserByEmailRepo
