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

    await this.loadUserByEmailRepo.load(email)
  }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', () => {
    const sut = new AuthUseCase()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@email.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserByEmailRepo withcorrect email', async () => {
    class LoadUserByEmailRepoSpy {
      async load (email) {
        this.email = email
      }
    }

    const loadUserByEmailRepoSpy = new LoadUserByEmailRepoSpy()
    const sut = new AuthUseCase(loadUserByEmailRepoSpy)
    await sut.auth('any_email@email.com', 'any_password')
    expect(loadUserByEmailRepoSpy.email).toBe('any_email@email.com')
  })
})
