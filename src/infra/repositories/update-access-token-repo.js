const { MissingParamError } = require('../../utils/errors')

class UpdateAccessTokenRepo {
  constructor (userSchema) {
    this.userSchema = userSchema
  }

  async update (userId, accessToken) {
    if (!userId) {
      throw new MissingParamError('userId')
    }

    if (!accessToken) {
      throw new MissingParamError('accessToken')
    }
    await this.userSchema.updateOne({
      _id: userId
    }, {
      $set: {
        accessToken
      }
    })
  }
}

module.exports = UpdateAccessTokenRepo
