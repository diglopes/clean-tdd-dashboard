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

const makeEncrypterWithError = () => {
  class EncrypterSpy {
    async compare (password, hashedPassword) {
      throw new Error()
    }
  }

  return new EncrypterSpy()
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

const makeTokenGeneratorWithError = () => {
  class TokenGeneratorSpy {
    generate (userId) {
      throw new Error()
    }
  }

  return new TokenGeneratorSpy()
}

const makeLoadUserByEmailRepo = () => {
  class LoadUserByEmailRepoSpy {
    async load (email) {
      this.email = email
      return this.user
    }
  }
  const loadUserByEmailRepo = new LoadUserByEmailRepoSpy()
  loadUserByEmailRepo.user = {
    id: 'any_id',
    password: 'hashed_password'
  }
  return loadUserByEmailRepo
}

const makeLoadUserByEmailRepoWithError = () => {
  class LoadUserByEmailRepoSpy {
    async load (email) {
      throw new Error()
    }
  }

  return new LoadUserByEmailRepoSpy()
}

const makeUpdateAccessTokenRepo = () => {
  class UpdateAccessTokenRepoSpy {
    async update (userId, accessToken) {
      this.userId = userId
      this.accessToken = accessToken
    }
  }

  return new UpdateAccessTokenRepoSpy()
}

const makeSut = () => {
  const encrypterSpy = makeEncrypter()
  const loadUserByEmailRepoSpy = makeLoadUserByEmailRepo()
  const tokenGeneratorSpy = makeTokenGenerator()
  const updateAccessTokenRepoSpy = makeUpdateAccessTokenRepo()

  const sut = new AuthUseCase({
    loadUserByEmailRepo: loadUserByEmailRepoSpy,
    updateAccessTokenRepo: updateAccessTokenRepoSpy,
    encrypter: encrypterSpy,
    tokenGenerator: tokenGeneratorSpy
  })
  return {
    sut,
    loadUserByEmailRepoSpy,
    updateAccessTokenRepoSpy,
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

  test('Should return an accessToken if correct credentials are provided', async () => {
    const { sut, tokenGeneratorSpy } = makeSut()
    const accessToken = await sut.auth(
      'valid_email@email.com',
      'valid_password'
    )
    expect(accessToken).toBe(tokenGeneratorSpy.accessToken)
    expect(accessToken).toBeTruthy()
  })

  test('Should call UpdateAccessTokenRepo with correct values', async () => {
    const {
      sut,
      tokenGeneratorSpy,
      loadUserByEmailRepoSpy,
      updateAccessTokenRepoSpy
    } = makeSut()
    await sut.auth('valid_email@email.com', 'valid_password')
    expect(updateAccessTokenRepoSpy.userId).toBe(
      loadUserByEmailRepoSpy.user.id
    )
    expect(updateAccessTokenRepoSpy.accessToken).toBe(
      tokenGeneratorSpy.accessToken
    )
  })

  test('Should throw if invalid dependencies are provided', () => {
    const invalid = {}
    const LoadUserByEmailRepo = makeLoadUserByEmailRepo()
    const encrypter = makeEncrypter()
    const tokenGenerator = makeTokenGenerator()

    const suts = [].concat(
      new AuthUseCase(),
      new AuthUseCase(invalid),
      new AuthUseCase({ LoadUserByEmailRepo: invalid }),
      new AuthUseCase({
        LoadUserByEmailRepo
      }),
      new AuthUseCase({
        LoadUserByEmailRepo,
        encrypter: invalid
      }),
      new AuthUseCase({
        LoadUserByEmailRepo,
        encrypter
      }),
      new AuthUseCase({
        LoadUserByEmailRepo,
        encrypter,
        tokenGenerator: invalid
      }),
      new AuthUseCase({
        LoadUserByEmailRepo,
        encrypter,
        tokenGenerator
      }),
      new AuthUseCase({
        LoadUserByEmailRepo,
        encrypter,
        tokenGenerator,
        updateAccessTokenRepo: invalid
      })
    )

    for (const sut of suts) {
      const promise = sut.auth('any_email@email.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })

  test('Should throw if any dependency throws', () => {
    const LoadUserByEmailRepo = makeLoadUserByEmailRepo()
    const encrypter = makeEncrypter()

    const suts = [].concat(
      new AuthUseCase({
        LoadUserByEmailRepo: makeLoadUserByEmailRepoWithError()
      }),
      new AuthUseCase({
        LoadUserByEmailRepo,
        encrypter: makeEncrypterWithError()
      }),
      new AuthUseCase({
        LoadUserByEmailRepo,
        encrypter,
        tokenGenerator: makeTokenGeneratorWithError()
      })
    )

    for (const sut of suts) {
      const promise = sut.auth('any_email@email.com', 'any_password')
      expect(promise).rejects.toThrow()
    }
  })
})
