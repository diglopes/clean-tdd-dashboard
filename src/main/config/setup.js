const helmet = require('helmet')
const cors = require('../middlewares/cors')
const jsonParser = require('../middlewares/json-parser')

module.exports = app => {
  app.use(helmet())
  app.use(cors)
  app.use(jsonParser)
}
