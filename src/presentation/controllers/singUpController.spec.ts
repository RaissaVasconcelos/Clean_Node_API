import { SingUpController } from './singUp'
import { MissingParamError } from '../errors/missing-params-errors'
import { InvalidParamError } from '../errors/invalid-params-errors'
import { EmailValidator } from '../protocols/email-validator'

interface SutTypes {
  sut: SingUpController
  emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes => {
  // injetando uma classe mockada para validação dos testes não é uma classe de produção
  class EmailValidatorStub implements EmailValidator{
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SingUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub,
  }
}

describe('SignUpController', () => {
  it('Should return 400 if no name is provided', () => {
    // sut -> system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'email@gmail.com',
        password: 'password',
        passwordValidate: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse?.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if no email is provided', () => {
    // sut -> system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name.any',
        password: 'password',
        passwordValidate: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('Should return 400 if no password is provided', () => {
    // sut -> system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name.any',
        email: 'email@gmail.com',
        passwordValidate: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if no password validate is provided', () => {
    // sut -> system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name.any',
        email: 'email@gmail.com',
        password: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordValidate'))
  })

  it('Should return 400 if no invalid email is provided', () => {
    // sut -> system under test
    const { sut, emailValidatorStub } = makeSut()
    // simular o metodo para falhar e retornar a mensagem esperada
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const httpRequest = {
      body: {
        name: 'name.any',
        email: 'invalid_email@gmail.com',
        password: 'password',
        passwordValidate: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should call EmailValidator with correct Email', () => {
    // sut -> system under test
    const { sut, emailValidatorStub } = makeSut()
    // simular o metodo para falhar e retornar a mensagem esperada
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')

    const httpRequest = {
      body: {
        name: 'name.any',
        email: 'any_email@gmail.com',
        password: 'password',
        passwordValidate: 'password'
      }
    }
    sut.handle(httpRequest)
    // espera que o metodo 
    expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com')
  })
})
