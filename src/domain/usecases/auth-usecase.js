const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor (loadUserByEmailRepo, encrypter) {
    this.loadUserByEmailRepo = loadUserByEmailRepo
    this.encrypter = encrypter
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }

    const user = await this.loadUserByEmailRepo.load(email)
    if (!user) {
      return null
    }

    await this.encrypter.compare(password, user.password)

    return null
  }
}

module.exports = AuthUseCase
