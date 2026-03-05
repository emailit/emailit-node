import { describe, it, expect } from 'vitest';
import { ApiResponse } from '../src/ApiResponse.js';

describe('ApiResponse', () => {
  it('parses JSON body', () => {
    const res = new ApiResponse(200, { 'content-type': 'application/json' }, '{"id":"em_1"}');
    expect(res.statusCode).toBe(200);
    expect(res.json).toEqual({ id: 'em_1' });
    expect(res.body).toBe('{"id":"em_1"}');
  });

  it('json is null for non-JSON body', () => {
    const res = new ApiResponse(502, {}, 'Bad Gateway');
    expect(res.json).toBeNull();
    expect(res.body).toBe('Bad Gateway');
  });

  it('stores headers', () => {
    const headers = { 'x-request-id': 'req_123' };
    const res = new ApiResponse(200, headers, '{}');
    expect(res.headers).toEqual(headers);
  });
});
