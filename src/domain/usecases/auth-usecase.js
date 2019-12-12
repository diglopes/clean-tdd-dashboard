const { MissingParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor (loadUserByEmailRepo) {
    this.loadUserByEmailRepo = loadUserByEmailRepo
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
  }
}

module.exports = AuthUseCase
