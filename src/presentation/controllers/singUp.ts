import { HttpResponse, HttpRequest, Controller, EmailValidator } from '../protocols'
import { badRequest, serverError } from '../helpers/http-helpers'
import { InvalidParamError, MissingParamError } from '../errors'
export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator

  constructor (emailIsValidate: EmailValidator) {
    this.emailValidator = emailIsValidate
  }

  handle (httpRequest: HttpRequest): HttpResponse | any {
    try {
      const requireFields = ['name', 'email', 'password', 'passwordValidate'];
      for (const field of requireFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const isValid = this.emailValidator.isValid(httpRequest.body.email)
  
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
