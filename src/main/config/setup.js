const helmet = require('helmet')
const cors = require('../middlewares/cors')
module.exports = app => {
  app.use(helmet())
  app.use(cors)
}
