import { describe, it, expect } from 'vitest';
import { mockClient, jsonResponse } from './helpers.js';
import { Collection } from '../src/Collection.js';

describe('TemplateService', () => {
  it('create() sends POST and returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(201, { object: 'template', id: 'tem_123', name: 'Welcome' }),
    ]);

    const template = await client.templates.create({
      name: 'Welcome',
      subject: 'Welcome!',
      html: '<h1>Hi {{name}}</h1>',
    });

    expect(template.id).toBe('tem_123');
    expect(requests[0].options.method).toBe('POST');
  });

  it('get() returns resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'template', id: 'tem_123', name: 'Welcome' }),
    ]);

    const template = await client.templates.get('tem_123');
    expect(template.id).toBe('tem_123');
    expect(requests[0].url).toContain('/v2/templates/tem_123');
  });

  it('update() sends POST', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'template', id: 'tem_123', subject: 'New Subject' }),
    ]);

    const template = await client.templates.update('tem_123', { subject: 'New Subject' });
    expect(template.subject).toBe('New Subject');
    expect(requests[0].options.method).toBe('POST');
  });

  it('list() returns Collection', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, {
        data: [{ object: 'template', id: 'tem_1' }],
        next_page_url: null,
      }),
    ]);

    const list = await client.templates.list({ per_page: 10 });
    expect(list).toBeInstanceOf(Collection);
    expect(requests[0].url).toContain('per_page=10');
  });

  it('delete() sends DELETE', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { deleted: true }),
    ]);

    await client.templates.delete('tem_123');
    expect(requests[0].options.method).toBe('DELETE');
  });

  it('publish() sends POST', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'template', id: 'tem_123', published: true }),
    ]);

    const template = await client.templates.publish('tem_123');
    expect(template.published).toBe(true);
    expect(requests[0].url).toContain('/v2/templates/tem_123/publish');
    expect(requests[0].options.method).toBe('POST');
  });
});
