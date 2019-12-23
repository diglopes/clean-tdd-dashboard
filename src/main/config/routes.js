const fg = require('fast-glob')
const router = require('express').Router()

module.exports = app => {
  app.use('/api', router)
  fg.sync('**/src/main/routes/**.js').forEach(file => require(`../../../${file}`)(router))
}
