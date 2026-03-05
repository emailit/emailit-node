import { describe, it, expect } from 'vitest';
import { mockClient, jsonResponse } from './helpers.js';
import { Collection } from '../src/Collection.js';

describe('SuppressionService', () => {
  it('create() sends POST and returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(201, { object: 'suppression', id: 'sup_123', email: 'spam@example.com' }),
    ]);

    const suppression = await client.suppressions.create({
      email: 'spam@example.com',
      type: 'hard_bounce',
    });

    expect(suppression.id).toBe('sup_123');
    expect(requests[0].options.method).toBe('POST');
  });

  it('get() returns resource', async () => {
    const { client } = mockClient([
      jsonResponse(200, { object: 'suppression', id: 'sup_123' }),
    ]);

    const suppression = await client.suppressions.get('sup_123');
    expect(suppression.id).toBe('sup_123');
  });

  it('update() sends POST', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'suppression', id: 'sup_123', reason: 'Updated' }),
    ]);

    const suppression = await client.suppressions.update('sup_123', { reason: 'Updated' });
    expect(suppression.reason).toBe('Updated');
    expect(requests[0].options.method).toBe('POST');
  });

  it('list() returns Collection', async () => {
    const { client } = mockClient([
      jsonResponse(200, {
        data: [{ object: 'suppression', id: 'sup_1' }],
        next_page_url: null,
      }),
    ]);

    const list = await client.suppressions.list();
    expect(list).toBeInstanceOf(Collection);
    expect(list.count).toBe(1);
  });

  it('delete() sends DELETE', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { deleted: true }),
    ]);

    await client.suppressions.delete('sup_123');
    expect(requests[0].options.method).toBe('DELETE');
  });
});
