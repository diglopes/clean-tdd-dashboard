const request = require('supertest')
const app = require('../config/app')
const bcrypt = require('bcrypt')
const MongoHelper = require('../../infra/helpers/mongo-helper')
const UserSchema = require('../../infra/repositories/schemas/user-schema')

describe('Login Routes', () => {
  beforeAll(async () => {
    const uri = 'mongodb://localhost:27017/test'
    await MongoHelper.connect(uri)
  })

  beforeEach(async () => {
    await UserSchema.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should return 200 when valid credentials are provided', async () => {
    await UserSchema.create({
      email: 'valid_email@email.com',
      password: bcrypt.hashSync('hashed_password', 10)
    })
    await request(app)
      .post('/api/login')
      .send({
        email: 'valid_email@email.com',
        password: 'hashed_password'
      })
      .expect(200)
  })
})
