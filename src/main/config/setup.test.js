const request = require('supertest')

describe('App Setup', () => {
  let app

  beforeEach(() => {
    jest.resetModules()
    app = require('./app')
  })

  test('Should add Helmet middleware', async () => {
    app.get('/test', (req, res) => {
      res.send('')
    })
    const res = await request(app).get('/test')
    expect(res.headers['x-powered-by']).toBeUndefined()
  })

  test('Should enable CORS', async () => {
    app.get('/test', (req, res) => {
      res.send('')
    })
    const res = await request(app).get('/test')
    expect(res.headers['access-control-allow-origin']).toBe('*')
    expect(res.headers['access-control-allow-methods']).toBe('*')
    expect(res.headers['access-control-allow-headers']).toBe('*')
  })

  test('Should parse body as JSON', async () => {
    app.post('/test', (req, res) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test').send({ working: true })
      .expect({ working: true })
  })

  test('Should return json content type as default', async () => {
    app.get('/test', (req, res) => {
      res.send('')
    })
    await request(app)
      .get('/test')
      .expect('content-type', /json/)
  })

  test('Should return xml content by forcing it', async () => {
    app.get('/test', (req, res) => {
      res.type('xml')
      res.send('')
    })
    await request(app)
      .get('/test')
      .expect('content-type', /xml/)
  })
})
