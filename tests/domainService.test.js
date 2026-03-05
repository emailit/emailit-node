import { describe, it, expect } from 'vitest';
import { mockClient, jsonResponse } from './helpers.js';
import { EmailitObject } from '../src/EmailitObject.js';
import { Collection } from '../src/Collection.js';
import { AuthenticationException, InvalidRequestException } from '../src/errors/index.js';

describe('DomainService', () => {
  it('create() sends POST and returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(201, { object: 'domain', id: 'sd_123', name: 'example.com', track_loads: true }),
    ]);

    const domain = await client.domains.create({ name: 'example.com', track_loads: true });
    expect(domain.id).toBe('sd_123');
    expect(domain.name).toBe('example.com');
    expect(requests[0].options.method).toBe('POST');
    expect(requests[0].url).toContain('/v2/domains');
  });

  it('get() returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'domain', id: 'sd_123', name: 'example.com' }),
    ]);

    const domain = await client.domains.get('sd_123');
    expect(domain.id).toBe('sd_123');
    expect(requests[0].url).toContain('/v2/domains/sd_123');
    expect(requests[0].options.method).toBe('GET');
  });

  it('verify() sends POST', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'domain', id: 'sd_123', verified: true }),
    ]);

    const domain = await client.domains.verify('sd_123');
    expect(domain.verified).toBe(true);
    expect(requests[0].url).toContain('/v2/domains/sd_123/verify');
    expect(requests[0].options.method).toBe('POST');
  });

  it('update() sends PATCH', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'domain', id: 'sd_123', track_clicks: false }),
    ]);

    const domain = await client.domains.update('sd_123', { track_clicks: false });
    expect(domain.track_clicks).toBe(false);
    expect(requests[0].options.method).toBe('PATCH');
  });

  it('list() returns a Collection', async () => {
    const { client } = mockClient([
      jsonResponse(200, {
        data: [
          { object: 'domain', id: 'sd_1' },
          { object: 'domain', id: 'sd_2' },
        ],
        next_page_url: null,
      }),
    ]);

    const list = await client.domains.list();
    expect(list).toBeInstanceOf(Collection);
    expect(list.count).toBe(2);
  });

  it('delete() sends DELETE', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'domain', id: 'sd_123', deleted: true }),
    ]);

    await client.domains.delete('sd_123');
    expect(requests[0].options.method).toBe('DELETE');
    expect(requests[0].url).toContain('/v2/domains/sd_123');
  });

  it('401 throws AuthenticationException', async () => {
    const { client } = mockClient([
      jsonResponse(401, { error: 'Unauthorized', message: 'Invalid API key' }),
    ]);
    await expect(client.domains.list()).rejects.toThrow(AuthenticationException);
  });

  it('404 throws InvalidRequestException', async () => {
    const { client } = mockClient([
      jsonResponse(404, { error: 'Domain not found' }),
    ]);
    await expect(client.domains.get('sd_nonexistent')).rejects.toThrow(InvalidRequestException);
  });
});
