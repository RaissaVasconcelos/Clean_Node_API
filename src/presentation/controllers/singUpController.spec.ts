import { SingUpController } from './singUp'
import { MissingParamError } from '../errors/missing-params-errors'

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
    console.log('error', httpResponse.body);
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParamError('name'))
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
    console.log('error', httpResponse.body);
    expect(httpResponse.statusCode).toBe(400)
    // expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})
