const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor (loadUserByEmailRepo, encrypter, tokenGeneratorSpy) {
    this.loadUserByEmailRepo = loadUserByEmailRepo
    this.encrypter = encrypter
    this.tokenGeneratorSpy = tokenGeneratorSpy
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

    const isValid = await this.encrypter.compare(password, user.password)

    if (!isValid) {
      return null
    }

    this.tokenGeneratorSpy.generate(user.id)
  }
}

module.exports = AuthUseCase
