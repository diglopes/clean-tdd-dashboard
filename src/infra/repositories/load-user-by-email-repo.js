class LoadUserByEmailRepo {
  constructor (UserSchema) {
    this.UserSchema = UserSchema
  }

  async load (email) {
    const user = await this.UserSchema.findOne({ email })
    if (!user) {
      return null
    }
    return { _id: user._id, password: user.password }
  }
}

module.exports = LoadUserByEmailRepo
