class UnauthorizedError extends Error {
  constructor (paramName) {
    super('unauthorizedError')
    this.name = 'UnauthorizedError'
  }
}

module.exports = UnauthorizedError
