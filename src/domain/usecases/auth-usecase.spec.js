const { MissingParamError } = require('../../utils/errors')
const AuthUseCase = require('./auth-usecase')

const makeEncrypter = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      this.password = password
      this.hashedPassword = hashedPassword
      return this.isValid
    }
  }
  const encrypterSpy = new EncrypterSpy()
  encrypterSpy.isValid = true
  return encrypterSpy
}

const makeTokenGenerator = () => {
  class TokenGeneratorSpy {
    generate (userId) {
      this.userId = userId
      return this.accessToken
    }
  }

  const tokenGeneratorSpy = new TokenGeneratorSpy()
  tokenGeneratorSpy.accessToken = 'valid_token'
  return tokenGeneratorSpy
}

const makeLoadUserByEmailRepo = () => {
  class LoadUserByEmailRepo {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepo = new LoadUserByEmailRepo()
  loadUserByEmailRepo.user = {
    id: 'any_id',
    password: 'hashed_password'
  }
  return loadUserByEmailRepo
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepoSpy = makeLoadUserByEmailRepo()
  const tokenGeneratorSpy = makeTokenGenerator()

  const sut = new AuthUseCase(
    loadUserByEmailRepoSpy,
    encrypterSpy,
    tokenGeneratorSpy
  )
  return {
    sut,
    loadUserByEmailRepoSpy,
    encrypterSpy,
    tokenGeneratorSpy
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
    const { sut, encrypterSpy } = makeSut()
    encrypterSpy.isValid = false
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

  test('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepoSpy, tokenGeneratorSpy } = makeSut()
    await sut.auth('valid_email@email.com', 'any_password')
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepoSpy.user.id)
  })
})
