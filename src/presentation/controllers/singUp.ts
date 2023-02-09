import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-params-errors'
import { badRequest } from '../helpers/http-helpers'
export class SingUpController {
  handle (httpRequest: HttpRequest): HttpResponse | any {
    const requireFields = ['name', 'email', 'password'];
    for (const field of requireFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(field));
      }
    }
  }
}
