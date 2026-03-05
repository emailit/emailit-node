import { describe, it, expect } from 'vitest';
import { mockClient, jsonResponse } from './helpers.js';
import { Collection } from '../src/Collection.js';

describe('SubscriberService', () => {
  it('create() sends POST with audience id in path', async () => {
    const { client, requests } = mockClient([
      jsonResponse(201, { object: 'subscriber', id: 'sub_456', email: 'user@example.com' }),
    ]);

    const subscriber = await client.subscribers.create('aud_123', {
      email: 'user@example.com',
      first_name: 'John',
    });

    expect(subscriber.id).toBe('sub_456');
    expect(requests[0].url).toContain('/v2/audiences/aud_123/subscribers');
    expect(requests[0].options.method).toBe('POST');
  });

  it('get() includes audience and subscriber ids', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'subscriber', id: 'sub_456' }),
    ]);

    const subscriber = await client.subscribers.get('aud_123', 'sub_456');
    expect(subscriber.id).toBe('sub_456');
    expect(requests[0].url).toContain('/v2/audiences/aud_123/subscribers/sub_456');
  });

  it('update() sends POST with both ids', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'subscriber', id: 'sub_456', first_name: 'Jane' }),
    ]);

    const subscriber = await client.subscribers.update('aud_123', 'sub_456', { first_name: 'Jane' });
    expect(subscriber.first_name).toBe('Jane');
    expect(requests[0].options.method).toBe('POST');
  });

  it('list() returns Collection with audience id in path', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, {
        data: [{ object: 'subscriber', id: 'sub_1' }],
        next_page_url: null,
      }),
    ]);

    const list = await client.subscribers.list('aud_123');
    expect(list).toBeInstanceOf(Collection);
    expect(requests[0].url).toContain('/v2/audiences/aud_123/subscribers');
  });

  it('list() with params passes query string', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { data: [], next_page_url: null }),
    ]);

    await client.subscribers.list('aud_123', { page: 2, limit: 25 });
    expect(requests[0].url).toContain('page=2');
    expect(requests[0].url).toContain('limit=25');
  });

  it('delete() sends DELETE', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { deleted: true }),
    ]);

    await client.subscribers.delete('aud_123', 'sub_456');
    expect(requests[0].options.method).toBe('DELETE');
    expect(requests[0].url).toContain('/v2/audiences/aud_123/subscribers/sub_456');
  });
});
