const MongoHelper = require('../helpers/mongo-helper')
const UserSchema = require('./schemas/user-schema')
const { MissingParamError } = require('../../utils/errors')
const UpdateAccessTokenRepo = require('./update-access-token-repo')

describe('UpdateAccessToken Repository', () => {
  let fakeUser

  beforeAll(async () => {
    const uri = 'mongodb://localhost:27017/test'
    await MongoHelper.connect(uri)
  })

  beforeEach(async () => {
    await UserSchema.deleteMany({})
    fakeUser = await UserSchema.create({
      email: 'valid_email@email.com',
      password: 'hashed_password',
      name: 'João'
    })
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should update the user with the given accessToken', async () => {
    const fakeUser = await UserSchema.create({
      email: 'valid_email@email.com',
      password: 'hashed_password',
      name: 'João'
    })

    const sut = new UpdateAccessTokenRepo(UserSchema)
    await sut.update(fakeUser._id, 'valid_token')
    const updatedFakeUser = await UserSchema.findById(fakeUser._id)
    expect(updatedFakeUser.accessToken).toBe('valid_token')
  })

  test('Should throw if no UserSchema is provided', async () => {
    const sut = new UpdateAccessTokenRepo()
    const promise = sut.update(fakeUser._id, 'valid_token')
    expect(promise).rejects.toThrow()
  })

  test('Should throw if no userId is provided', async () => {
    const sut = new UpdateAccessTokenRepo()
    const promise = sut.update()
    expect(promise).rejects.toThrow(new MissingParamError('userId'))
  })

  test('Should throw if no accessToken is provided', async () => {
    const sut = new UpdateAccessTokenRepo()
    const promise = sut.update(fakeUser._id)
    expect(promise).rejects.toThrow(new MissingParamError('accessToken'))
  })
})
