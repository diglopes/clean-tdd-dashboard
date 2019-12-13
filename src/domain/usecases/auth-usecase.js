const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor (args = {}) {
    const {
      loadUserByEmailRepo,
      updateAccessTokenRepo,
      encrypter,
      tokenGenerator
    } = args
    this.loadUserByEmailRepo = loadUserByEmailRepo
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepo = updateAccessTokenRepo
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
      await this.updateAccessTokenRepo.update(user.id, accessToken)
      return accessToken
    }

    return null
  }
}

module.exports = AuthUseCase
