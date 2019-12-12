const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeSut = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
    }
  }
  const encrypterSpy = new EncrypterSpy()

  class LoadUserByEmailRepoSpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepoSpy = new LoadUserByEmailRepoSpy()
  loadUserByEmailRepoSpy.user = {
    password: 'hashed_password'
  }

  const sut = new AuthUseCase(loadUserByEmailRepoSpy, encrypterSpy)
  return {
    sut,
    loadUserByEmailRepoSpy,
    encrypterSpy
  }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@email.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserByEmailRepo withcorrect email', async () => {
    const { sut, loadUserByEmailRepoSpy } = makeSut()
    await sut.auth('any_email@email.com', 'any_password')
    expect(loadUserByEmailRepoSpy.email).toBe('any_email@email.com')
  })

  test('Should throw if no LoadUserByEmailRepo is provided', () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@email.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadUserByEmailRepo has no load method', () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@email.com', 'any_password')
    expect(promise).rejects.toThrow()
  })

  test('Should return null if an invalid email is provided', async () => {
    const { sut, loadUserByEmailRepoSpy } = makeSut()
    loadUserByEmailRepoSpy.user = null
    const accessToken = await sut.auth(
      'invalid_email@email.com',
      'any_password'
    )
    expect(accessToken).toBeNull()
  })

  test('Should return null if an invalid password is provided', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(
      'valid_email@email.com',
      'invalid_password'
    )
    expect(accessToken).toBeNull()
  })

  test('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepoSpy, encrypterSpy } = makeSut()
    await sut.auth('valid_email@email.com', 'any_password')
    expect(encrypterSpy.password).toBe('any_password')
    expect(encrypterSpy.hashedPassword).toBe(
      loadUserByEmailRepoSpy.user.password
    )
  })
})
