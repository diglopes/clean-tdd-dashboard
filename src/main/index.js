const app = require('./config/app')
const MongoHelper = require('../infra/helpers/mongo-helper')
const env = require('./config/env')

const bootstrap = async () => {
  try {
    await MongoHelper.connect(env.mongoUrl)
    console.log('>> Database connected')

    await app.listen(3333, () => console.log('>> Server running'))
  } catch (error) {
    console.error(error)
  }
}

bootstrap()
