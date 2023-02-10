import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-params-errors'
import { badRequest } from '../helpers/http-helpers'
import { Controller } from '../protocols/controllers'
import { EmailValidator } from '../protocols/email-validator'
import { InvalidParamError } from '../errors/invalid-params-errors'
import { ServerError } from '../errors/server-errors'
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
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }
  }
}
