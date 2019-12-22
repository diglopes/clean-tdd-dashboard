const helmet = require('../middlewares/helmet')
const cors = require('../middlewares/cors')
const jsonParser = require('../middlewares/json-parser')

module.exports = app => {
  app.use(helmet)
  app.use(cors)
  app.use(jsonParser)
}
