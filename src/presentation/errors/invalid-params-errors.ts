export class InvalidParamError extends Error {
  constructor(message: string) {
    super(`Invalid param: ${message}`)
    this.name = 'MissingParamError'
  } 
}
