const request = require('supertest')
const app = require('./app')

describe('App Setup', () => {
  test('Should add Helmet middleware', async () => {
    app.get('/test_helmet', (req, res) => {
      res.send('')
    })
    const res = await request(app).get('/test_helmet')
    expect(res.headers['x-powered-by']).toBeUndefined()
  })
})
