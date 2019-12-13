const { MissingParamError } = require('../src/utils/errors')

module.exports = {
  isValid: true,
  async compare (value, hash) {
    if (!value) throw new MissingParamError('value')
    if (!hash) throw new MissingParamError('hash')

    this.value = value
    this.hash = hash
    return this.isValid
  }
}
