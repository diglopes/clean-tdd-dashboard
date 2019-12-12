const { UnauthorizedError, ServerError } = require('../errors')

class HttpResponse {
  static badRequest (Error) {
    return {
      statusCode: 400,
      body: Error
    }
  }

  static internalError () {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }

  static unauthorizedError () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }

  static ok (data) {
    return {
      statusCode: 200,
      body: data
    }
  }
}

module.exports = HttpResponse
