import { SingUpController } from './singUp'
import { MissingParamError, InvalidParamError, ServerError } from '../../errors'
import { EmailValidator } from '../../protocols'
import { AccountModel } from '../../../domain/models'
import { AddAccount, AddAccountModel } from '../../../domain/usecases/add-account'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator{
    isValid(email: string): boolean {
      return true;
    }
  }
  
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'id_validate',
        name: 'name_validate',
        email: 'email_validate',
        password: 'password_validate'
      }
      return fakeAccount;
    }
  }
  return new AddAccountStub()
}
interface SutTypes {
  sut: SingUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeSut = (): SutTypes => {
  // injetando uma classe mockada para validação dos testes não é uma classe de produção
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SingUpController(emailValidatorStub, addAccountStub)
  return {
    sut,
    emailValidatorStub,
    addAccountStub
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

  it('Should return 400 if no password confirmation fails', () => {
    // sut -> system under test
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name.any',
        email: 'email@gmail.com',
        password: 'password',
        passwordValidate: 'password_false'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordValidate'))
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

  it('Should returns 500 if EmailValidator throws', () => {
    // mock de uma função que retorna uma exceção
    class EmailValidatorStub implements EmailValidator{
      isValid(email: string): boolean {
        throw new Error();
      }
    }
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'name.any',
        email: 'any_email@gmail.com',
        password: 'password',
        passwordValidate: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('Should call AddAcount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

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
    expect(addSpy).toHaveBeenCalledWith({
      name: 'name.any',
      email: 'any_email@gmail.com',
      password: 'password',
    })
  })

  it('Should returns 500 if AddAccount throws', () => {
    // mock de uma função que retorna uma exceção

    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'password',
        passwordValidate: 'password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
