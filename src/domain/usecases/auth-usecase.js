const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor ({
    loadUserByEmailRepo,
    updateAccessTokenRepo,
    encrypter,
    tokenGenerator
  } = {}) {
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
      const accessToken = await this.tokenGenerator.generate(user._id)
      await this.updateAccessTokenRepo.update(user._id, accessToken)
      return accessToken
    }

    return null
  }
}

module.exports = AuthUseCase
