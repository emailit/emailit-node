import { describe, it, expect } from 'vitest';
import { mockClient, jsonResponse } from './helpers.js';
import { Collection } from '../src/Collection.js';

describe('WebhookService', () => {
  it('create() sends POST and returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(201, { object: 'webhook', id: 'wh_123', name: 'My Webhook', url: 'https://example.com/hook' }),
    ]);

    const webhook = await client.webhooks.create({
      name: 'My Webhook',
      url: 'https://example.com/hook',
      all_events: true,
      enabled: true,
    });

    expect(webhook.id).toBe('wh_123');
    expect(webhook.name).toBe('My Webhook');
    expect(requests[0].options.method).toBe('POST');
  });

  it('get() returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'webhook', id: 'wh_123' }),
    ]);

    const webhook = await client.webhooks.get('wh_123');
    expect(webhook.id).toBe('wh_123');
    expect(requests[0].url).toContain('/v2/webhooks/wh_123');
  });

  it('update() sends POST', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'webhook', id: 'wh_123', enabled: false }),
    ]);

    const webhook = await client.webhooks.update('wh_123', { enabled: false });
    expect(webhook.enabled).toBe(false);
    expect(requests[0].options.method).toBe('POST');
  });

  it('list() returns Collection', async () => {
    const { client } = mockClient([
      jsonResponse(200, {
        data: [{ object: 'webhook', id: 'wh_1' }],
        next_page_url: null,
      }),
    ]);

    const list = await client.webhooks.list();
    expect(list).toBeInstanceOf(Collection);
    expect(list.count).toBe(1);
  });

  it('delete() sends DELETE', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'webhook', id: 'wh_123', deleted: true }),
    ]);

    await client.webhooks.delete('wh_123');
    expect(requests[0].options.method).toBe('DELETE');
  });
});
