const mongoose = require('mongoose')
const UserSchema = require('./schemas/user-schema')
const LoadUserByEmailRepo = require('./load-user-by-email-repo')

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
    const fakeUser = await UserSchema.create({
      email: 'valid_email@email.com',
      password: '123456',
      name: 'João'
    })
    const sut = makeSut()
    const user = await sut.load('valid_email@email.com')
    expect(user).toEqual({
      _id: fakeUser._id,
      password: fakeUser.password
    })
  })
})
