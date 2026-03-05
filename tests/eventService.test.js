import { describe, it, expect } from 'vitest';
import { mockClient, jsonResponse } from './helpers.js';
import { Collection } from '../src/Collection.js';

describe('EventService', () => {
  it('list() returns Collection', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, {
        data: [
          { object: 'event', id: 'evt_1', type: 'email.delivered' },
          { object: 'event', id: 'evt_2', type: 'email.bounced' },
        ],
        next_page_url: null,
      }),
    ]);

    const list = await client.events.list({ type: 'email.delivered' });
    expect(list).toBeInstanceOf(Collection);
    expect(list.count).toBe(2);
    expect(requests[0].url).toContain('type=email.delivered');
  });

  it('get() returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, {
        object: 'event',
        id: 'evt_123',
        type: 'email.delivered',
        data: { email_id: 'em_abc' },
      }),
    ]);

    const event = await client.events.get('evt_123');
    expect(event.id).toBe('evt_123');
    expect(event.type).toBe('email.delivered');
    expect(event.data.email_id).toBe('em_abc');
    expect(requests[0].url).toContain('/v2/events/evt_123');
  });

  it('list() with include_data param', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { data: [], next_page_url: null }),
    ]);

    await client.events.list({ include_data: true });
    expect(requests[0].url).toContain('include_data=true');
  });
});
