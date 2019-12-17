const mongoose = require('mongoose')
const UserSchema = require('./schemas/user-schema')

class LoadUserByEmailRepo {
  constructor (UserSchema) {
    this.UserSchema = UserSchema
  }

  async load (email) {
    const user = await this.UserSchema.findOne({ email })
    return user
  }
}

const makeSut = () => {
  return new LoadUserByEmailRepo(UserSchema)
}

describe('LoadUserByEmail Repository', () => {
  beforeAll(async () => {
    const url = 'mongodb://localhost:27017/test'
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  })

  beforeEach(async () => {
    await UserSchema.deleteMany({})
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  test('Should return null if no user is found', async () => {
    const sut = makeSut()
    const user = await sut.load('invalid_email@email.com')
    expect(user).toBeNull()
  })

  test('Should return an user if user is found', async () => {
    const email = 'valid_email@email.com'
    await UserSchema.create({ email })
    const sut = makeSut()
    const user = await sut.load(email)
    expect(user.email).toBe(email)
  })
})
