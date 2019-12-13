const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor (args = {}) {
    const { loadUserByEmailRepo, encrypter, tokenGenerator } = args
    this.loadUserByEmailRepo = loadUserByEmailRepo
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }

    const user = await this.loadUserByEmailRepo.load(email)
    const isValid =
      user && (await this.encrypter.compare(password, user.password))
    if (isValid) {
      const accessToken = this.tokenGenerator.generate(user.id)
      return accessToken
    }

    return null
  }
}

module.exports = AuthUseCase
