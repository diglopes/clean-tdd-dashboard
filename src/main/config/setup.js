const helmet = require('helmet')

module.exports = app => {
  app.use(helmet())
  app.use((req, res, next) => {
    res.set('access-control-allow-origin', '*')
    res.set('access-control-allow-methods', '*')
    res.set('access-control-allow-headers', '*')
    next()
  })
}
