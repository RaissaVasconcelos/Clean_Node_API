import { SingUpController } from './singUp'

describe('SignUpController', () => {
  test('Should return 400 if no name is provided', () => {
    // sut -> system under test
    const sut = new SingUpController()
    const httpRequest = {
      body: {
        email: 'email@gmail.com',
        password: 'password',
        passwordValidate: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing: param: name'))
  })

  test('Should return 400 if no email is provided', () => {
    // sut -> system under test
    const sut = new SingUpController()
    const httpRequest = {
      body: {
        name: 'name.any',
        password: 'password',
        passwordValidate: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new Error('Missing: param: email'))
  })
})
