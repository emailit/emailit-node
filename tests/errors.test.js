import { describe, it, expect } from 'vitest';
import {
  ApiErrorException,
  ApiConnectionException,
  AuthenticationException,
  InvalidRequestException,
  RateLimitException,
  UnprocessableEntityException,
  createApiError,
} from '../src/errors/index.js';

describe('ApiErrorException', () => {
  it('stores all properties', () => {
    const err = new ApiErrorException('test error', 400, '{"error":"bad"}', { error: 'bad' }, { 'x-request-id': 'req_1' });
    expect(err.message).toBe('test error');
    expect(err.httpStatus).toBe(400);
    expect(err.httpBody).toBe('{"error":"bad"}');
    expect(err.jsonBody).toEqual({ error: 'bad' });
    expect(err.httpHeaders).toEqual({ 'x-request-id': 'req_1' });
  });

  it('extends Error', () => {
    const err = new ApiErrorException('test');
    expect(err).toBeInstanceOf(Error);
  });

  it('defaults are set', () => {
    const err = new ApiErrorException('test');
    expect(err.httpStatus).toBe(0);
    expect(err.httpBody).toBe('');
    expect(err.jsonBody).toBeNull();
    expect(err.httpHeaders).toEqual({});
  });
});

describe('createApiError factory', () => {
  it('returns AuthenticationException for 401', () => {
    const err = createApiError('Unauthorized', 401, '', null, {});
    expect(err).toBeInstanceOf(AuthenticationException);
    expect(err).toBeInstanceOf(ApiErrorException);
  });

  it('returns InvalidRequestException for 400', () => {
    const err = createApiError('Bad Request', 400, '', null, {});
    expect(err).toBeInstanceOf(InvalidRequestException);
  });

  it('returns InvalidRequestException for 404', () => {
    const err = createApiError('Not Found', 404, '', null, {});
    expect(err).toBeInstanceOf(InvalidRequestException);
  });

  it('returns UnprocessableEntityException for 422', () => {
    const err = createApiError('Validation', 422, '', null, {});
    expect(err).toBeInstanceOf(UnprocessableEntityException);
  });

  it('returns RateLimitException for 429', () => {
    const err = createApiError('Rate limit', 429, '', null, {});
    expect(err).toBeInstanceOf(RateLimitException);
  });

  it('returns ApiErrorException for other statuses', () => {
    const err = createApiError('Server error', 500, '', null, {});
    expect(err).toBeInstanceOf(ApiErrorException);
    expect(err).not.toBeInstanceOf(AuthenticationException);
  });
});

describe('exception inheritance', () => {
  it('AuthenticationException extends ApiErrorException', () => {
    expect(new AuthenticationException('test')).toBeInstanceOf(ApiErrorException);
  });

  it('InvalidRequestException extends ApiErrorException', () => {
    expect(new InvalidRequestException('test')).toBeInstanceOf(ApiErrorException);
  });

  it('RateLimitException extends ApiErrorException', () => {
    expect(new RateLimitException('test')).toBeInstanceOf(ApiErrorException);
  });

  it('UnprocessableEntityException extends ApiErrorException', () => {
    expect(new UnprocessableEntityException('test')).toBeInstanceOf(ApiErrorException);
  });

  it('ApiConnectionException extends ApiErrorException', () => {
    expect(new ApiConnectionException('test')).toBeInstanceOf(ApiErrorException);
  });
});
