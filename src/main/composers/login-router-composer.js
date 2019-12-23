const LoginRouter = require('../../presentation/routers/login-router')
const AuthUseCase = require('../../domain/usecases/auth-usecase')
const EmailValidator = require('../../utils/helpers/email-validator')
const LoadUserByEmailRepo = require('../../infra/repositories/load-user-by-email-repo')
const UpdateAccessTokenRepo = require('../../infra/repositories/update-access-token-repo')
const Encrypter = require('../../utils/helpers/encrypter')
const TokenGenerator = require('../../utils/helpers/token-generator')
const env = require('../config/env')
const userSchema = require('../../infra/repositories/schemas/user-schema')

class LoginRouterComposer {
  static compose () {
    const tokenGenerator = new TokenGenerator(env.tokenSecret)
    const encrypter = new Encrypter()
    const loadUserByEmailRepo = new LoadUserByEmailRepo(userSchema)
    const updateAccessTokenRepo = new UpdateAccessTokenRepo(userSchema)
    const emailValidator = new EmailValidator()
    const authUseCase = new AuthUseCase({
      loadUserByEmailRepo,
      updateAccessTokenRepo,
      encrypter,
      tokenGenerator
    })
    const loginRouter = new LoginRouter({ authUseCase, emailValidator })
    return loginRouter
  }
}

module.exports = LoginRouterComposer
