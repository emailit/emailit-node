import { describe, it, expect } from 'vitest';
import { mockClient, jsonResponse } from './helpers.js';
import { Collection } from '../src/Collection.js';

describe('ContactService', () => {
  it('create() sends POST and returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(201, { object: 'contact', id: 'con_123', email: 'user@example.com' }),
    ]);

    const contact = await client.contacts.create({
      email: 'user@example.com',
      first_name: 'John',
      last_name: 'Doe',
    });

    expect(contact.id).toBe('con_123');
    expect(requests[0].options.method).toBe('POST');
    expect(requests[0].url).toContain('/v2/contacts');
  });

  it('get() returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'contact', id: 'con_123' }),
    ]);

    const contact = await client.contacts.get('con_123');
    expect(contact.id).toBe('con_123');
    expect(requests[0].url).toContain('/v2/contacts/con_123');
  });

  it('update() sends POST', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'contact', id: 'con_123', first_name: 'Jane' }),
    ]);

    const contact = await client.contacts.update('con_123', { first_name: 'Jane' });
    expect(contact.first_name).toBe('Jane');
    expect(requests[0].options.method).toBe('POST');
  });

  it('list() returns Collection', async () => {
    const { client } = mockClient([
      jsonResponse(200, {
        data: [{ object: 'contact', id: 'con_1' }, { object: 'contact', id: 'con_2' }],
        next_page_url: null,
      }),
    ]);

    const list = await client.contacts.list();
    expect(list).toBeInstanceOf(Collection);
    expect(list.count).toBe(2);
  });

  it('delete() sends DELETE', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { deleted: true }),
    ]);

    await client.contacts.delete('con_123');
    expect(requests[0].options.method).toBe('DELETE');
  });
});
