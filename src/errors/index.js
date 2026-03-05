import { ApiErrorException } from './ApiErrorException.js';
import { ApiConnectionException } from './ApiConnectionException.js';
import { AuthenticationException } from './AuthenticationException.js';
import { InvalidRequestException } from './InvalidRequestException.js';
import { RateLimitException } from './RateLimitException.js';
import { UnprocessableEntityException } from './UnprocessableEntityException.js';

export {
  ApiErrorException,
  ApiConnectionException,
  AuthenticationException,
  InvalidRequestException,
  RateLimitException,
  UnprocessableEntityException,
};

export function createApiError(message, httpStatus, httpBody, jsonBody, httpHeaders) {
  switch (httpStatus) {
    case 401:
      return new AuthenticationException(message, httpStatus, httpBody, jsonBody, httpHeaders);
    case 429:
      return new RateLimitException(message, httpStatus, httpBody, jsonBody, httpHeaders);
    case 422:
      return new UnprocessableEntityException(message, httpStatus, httpBody, jsonBody, httpHeaders);
    case 400:
    case 404:
      return new InvalidRequestException(message, httpStatus, httpBody, jsonBody, httpHeaders);
    default:
      return new ApiErrorException(message, httpStatus, httpBody, jsonBody, httpHeaders);
  }
}
