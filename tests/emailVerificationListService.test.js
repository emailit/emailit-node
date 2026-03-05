import { describe, it, expect } from 'vitest';
import { mockClient, jsonResponse } from './helpers.js';
import { Collection } from '../src/Collection.js';
import { ApiResponse } from '../src/ApiResponse.js';

describe('EmailVerificationListService', () => {
  it('create() sends POST and returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(201, {
        object: 'email_verification_list',
        id: 'evl_abc123',
        name: 'Marketing List Q1',
        status: 'pending',
      }),
    ]);

    const list = await client.emailVerificationLists.create({
      name: 'Marketing List Q1',
      emails: ['user1@example.com', 'user2@example.com'],
    });

    expect(list.id).toBe('evl_abc123');
    expect(list.status).toBe('pending');
    expect(requests[0].options.method).toBe('POST');
  });

  it('list() returns Collection', async () => {
    const { client } = mockClient([
      jsonResponse(200, {
        data: [{ object: 'email_verification_list', id: 'evl_1' }],
        next_page_url: null,
      }),
    ]);

    const list = await client.emailVerificationLists.list();
    expect(list).toBeInstanceOf(Collection);
  });

  it('get() returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, {
        object: 'email_verification_list',
        id: 'evl_abc123',
        stats: { successful_verifications: 42 },
      }),
    ]);

    const result = await client.emailVerificationLists.get('evl_abc123');
    expect(result.id).toBe('evl_abc123');
    expect(result.stats.successful_verifications).toBe(42);
    expect(requests[0].url).toContain('/v2/email-verification-lists/evl_abc123');
  });

  it('results() returns Collection with params', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, {
        data: [{ email: 'user1@example.com', result: 'valid' }],
        next_page_url: null,
      }),
    ]);

    const results = await client.emailVerificationLists.results('evl_abc123', { page: 1, limit: 50 });
    expect(results).toBeInstanceOf(Collection);
    expect(requests[0].url).toContain('/v2/email-verification-lists/evl_abc123/results');
    expect(requests[0].url).toContain('page=1');
  });

  it('export() returns raw ApiResponse', async () => {
    const { client, requests } = mockClient([{
      status: 200,
      body: 'binary xlsx data',
      headers: { 'content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    }]);

    const response = await client.emailVerificationLists.export('evl_abc123');
    expect(response).toBeInstanceOf(ApiResponse);
    expect(response.body).toBe('binary xlsx data');
    expect(requests[0].url).toContain('/v2/email-verification-lists/evl_abc123/export');
  });
});
