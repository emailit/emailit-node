import { describe, it, expect } from 'vitest';
import { mockClient, jsonResponse } from './helpers.js';
import { Collection } from '../src/Collection.js';

describe('AudienceService', () => {
  it('create() sends POST and returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(201, { object: 'audience', id: 'aud_123', name: 'Newsletter', token: 'tok_xxx' }),
    ]);

    const audience = await client.audiences.create({ name: 'Newsletter' });
    expect(audience.id).toBe('aud_123');
    expect(audience.token).toBe('tok_xxx');
    expect(requests[0].options.method).toBe('POST');
  });

  it('get() returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'audience', id: 'aud_123', name: 'Newsletter' }),
    ]);

    const audience = await client.audiences.get('aud_123');
    expect(audience.id).toBe('aud_123');
    expect(requests[0].url).toContain('/v2/audiences/aud_123');
  });

  it('update() sends POST', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'audience', id: 'aud_123', name: 'Updated Newsletter' }),
    ]);

    const audience = await client.audiences.update('aud_123', { name: 'Updated Newsletter' });
    expect(audience.name).toBe('Updated Newsletter');
    expect(requests[0].options.method).toBe('POST');
  });

  it('list() returns Collection', async () => {
    const { client } = mockClient([
      jsonResponse(200, {
        data: [{ object: 'audience', id: 'aud_1' }, { object: 'audience', id: 'aud_2' }],
        next_page_url: null,
      }),
    ]);

    const list = await client.audiences.list();
    expect(list).toBeInstanceOf(Collection);
    expect(list.count).toBe(2);
  });

  it('delete() sends DELETE', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'audience', id: 'aud_123', deleted: true }),
    ]);

    await client.audiences.delete('aud_123');
    expect(requests[0].options.method).toBe('DELETE');
  });
});
