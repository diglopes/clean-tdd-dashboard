const app = require('./config/app')
const MongoHelper = require('../infra/helpers/mongo-helper')
const env = require('./config/env')

const bootstrap = async () => {
  try {
    await MongoHelper.connect(env.mongoUrl)
    console.log('>> Database connected')

    await app.listen(env.port, () => console.log(`>> Server running on port ${env.port}`))
  } catch (error) {
    console.error(error)
  }
}

bootstrap()
