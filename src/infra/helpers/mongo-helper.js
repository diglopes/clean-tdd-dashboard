const mongoose = require('mongoose')

module.exports = {
  async connect (uri) {
    const connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    this.connection = connection
  },

  async disconnect () {
    await this.connection.close()
  }
}
