import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-params-errors'
import { badRequest } from '../helpers/http-helpers'
import { Controller } from '../protocols/controllers'
export class SingUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse | any {
    const requireFields = ['name', 'email', 'password', 'passwordValidate'];
    for (const field of requireFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
