const { UnauthorizedError, ServerError } = require('../errors')

class HttpResponse {
  static badRequest (error) {
    return {
      statusCode: 400,
      body: { error: error.message }
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
      body: { error: new UnauthorizedError().message }
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
