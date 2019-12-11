const MissingParamError = require('../helpers/missing-param-error')

class HttpResponse {
  static badRequest (paramName) {
    return {
      statusCode: 400,
      body: new MissingParamError(paramName)
    }
  }

  static internalError () {
    return {
      statusCode: 500
    }
  }
}

module.exports = HttpResponse
