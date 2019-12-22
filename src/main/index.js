const express = require('express')
const helmet = require('helmet')
const app = express()

app.use(helmet())
app.get('/api-mango', (req, res) => {
  res.send('mango')
})

app.listen(3333, () => console.log('>> Server running'))
