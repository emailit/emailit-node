import { describe, it, expect } from 'vitest';
import { mockClient, jsonResponse } from './helpers.js';
import { Collection } from '../src/Collection.js';

describe('ApiKeyService', () => {
  it('create() sends POST and returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(201, { object: 'api_key', id: 'ak_123', name: 'Production Key', key: 'em_live_xxx' }),
    ]);

    const key = await client.apiKeys.create({ name: 'Production Key', scope: 'full' });
    expect(key.id).toBe('ak_123');
    expect(key.key).toBe('em_live_xxx');
    expect(requests[0].options.method).toBe('POST');
    expect(requests[0].url).toContain('/v2/api-keys');
  });

  it('get() returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'api_key', id: 'ak_123', name: 'Production Key' }),
    ]);

    const key = await client.apiKeys.get('ak_123');
    expect(key.id).toBe('ak_123');
    expect(requests[0].url).toContain('/v2/api-keys/ak_123');
  });

  it('list() returns Collection', async () => {
    const { client } = mockClient([
      jsonResponse(200, {
        data: [{ object: 'api_key', id: 'ak_1' }, { object: 'api_key', id: 'ak_2' }],
        next_page_url: null,
      }),
    ]);

    const list = await client.apiKeys.list();
    expect(list).toBeInstanceOf(Collection);
    expect(list.count).toBe(2);
  });

  it('update() sends POST', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'api_key', id: 'ak_123', name: 'Renamed Key' }),
    ]);

    const key = await client.apiKeys.update('ak_123', { name: 'Renamed Key' });
    expect(key.name).toBe('Renamed Key');
    expect(requests[0].options.method).toBe('POST');
  });

  it('delete() sends DELETE', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'api_key', id: 'ak_123', deleted: true }),
    ]);

    await client.apiKeys.delete('ak_123');
    expect(requests[0].options.method).toBe('DELETE');
  });
});
