const UserSchema = require('./schemas/user-schema')
const LoadUserByEmailRepo = require('./load-user-by-email-repo')
const MongoHelper = require('../helpers/mongo-helper')
const { MissingParamError } = require('../../utils/errors')

const makeSut = () => {
  return new LoadUserByEmailRepo(UserSchema)
}

describe('LoadUserByEmail Repository', () => {
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

  test('Should throw if no UserSchema is provided', async () => {
    const sut = new LoadUserByEmailRepo()
    const promise = sut.load('any_email@email.com')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if no email is provided', async () => {
    const sut = makeSut()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })
})
