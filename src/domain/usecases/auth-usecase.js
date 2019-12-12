const { MissingParamError, InvalidParamError } = require('../../utils/errors')

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
    if (!this.loadUserByEmailRepo) {
      throw new MissingParamError('loadUserByEmailRepo')
    }
    if (!this.loadUserByEmailRepo.load) {
      throw new InvalidParamError('loadUserByEmailRepo')
    }

    const user = await this.loadUserByEmailRepo.load(email)
    if (!user) {
      return null
    }
  }
}

module.exports = AuthUseCase
