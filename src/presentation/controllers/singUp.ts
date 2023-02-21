import { HttpResponse, HttpRequest, Controller, EmailValidator } from '../protocols'
import { badRequest, serverError } from '../helpers/http-helpers'
import { InvalidParamError, MissingParamError } from '../errors'
import { AddAccount } from '../../domain/usecases/add-account'
export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly addAccount: AddAccount

  constructor (emailIsValidate: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailIsValidate
    this.addAccount = addAccount
  }

  handle (httpRequest: HttpRequest): HttpResponse | any {
    try {
      const requireFields = ['name', 'email', 'password', 'passwordValidate'];

      for (const field of requireFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      
      const { name, email, password, passwordValidate } = httpRequest.body;

      if (password !== passwordValidate) {
        return badRequest(new InvalidParamError('passwordValidate'))
      }

      const isValid = this.emailValidator.isValid(email)
      
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      this.addAccount.add({ name, email, password })

    } catch (error) {
      return serverError()
    }
  }
}
