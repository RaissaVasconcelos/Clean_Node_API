export class MissingParamError extends Error {
  constructor(message: string) {
    super(`Missing param: ${message}`)
    this.name = 'MissingParamError'
  } 
}
