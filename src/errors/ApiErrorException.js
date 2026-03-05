export class ApiErrorException extends Error {
  constructor(message, httpStatus = 0, httpBody = '', jsonBody = null, httpHeaders = {}) {
    super(message);
    this.name = this.constructor.name;
    this.httpStatus = httpStatus;
    this.httpBody = httpBody;
    this.jsonBody = jsonBody;
    this.httpHeaders = httpHeaders;
  }
}
