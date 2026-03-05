import { describe, it, expect } from 'vitest';
import { mockClient, jsonResponse } from './helpers.js';
import { EmailitObject } from '../src/EmailitObject.js';
import { Collection } from '../src/Collection.js';
import { AuthenticationException, InvalidRequestException, RateLimitException, UnprocessableEntityException, ApiConnectionException } from '../src/errors/index.js';

describe('EmailService', () => {
  // ── send() ──

  it('send() returns an EmailitObject', async () => {
    const responseBody = {
      object: 'email',
      id: 'em_abc123',
      status: 'pending',
      from: 'hello@example.com',
      to: ['user@example.com'],
      subject: 'Hello World',
    };

    const { client, requests } = mockClient([jsonResponse(201, responseBody)]);

    const email = await client.emails.send({
      from: 'hello@example.com',
      to: ['user@example.com'],
      subject: 'Hello World',
      html: '<h1>Welcome!</h1>',
    });

    expect(email).toBeInstanceOf(EmailitObject);
    expect(email.id).toBe('em_abc123');
    expect(email.status).toBe('pending');
    expect(email.from).toBe('hello@example.com');
    expect(email.to).toEqual(['user@example.com']);
    expect(email.subject).toBe('Hello World');

    const req = requests[0];
    expect(req.options.method).toBe('POST');
    expect(req.url).toContain('/v2/emails');

    const body = JSON.parse(req.options.body);
    expect(body.from).toBe('hello@example.com');
    expect(body.html).toBe('<h1>Welcome!</h1>');
  });

  it('send() with template and variables', async () => {
    const { client, requests } = mockClient([
      jsonResponse(201, { object: 'email', id: 'em_tmpl', status: 'pending' }),
    ]);

    await client.emails.send({
      from: 'hello@example.com',
      to: 'user@example.com',
      template: 'welcome_email',
      variables: { name: 'John' },
    });

    const body = JSON.parse(requests[0].options.body);
    expect(body.template).toBe('welcome_email');
    expect(body.variables).toEqual({ name: 'John' });
  });

  it('send() with attachments', async () => {
    const { client, requests } = mockClient([
      jsonResponse(201, { object: 'email', id: 'em_att', status: 'pending' }),
    ]);

    await client.emails.send({
      from: 'hello@example.com',
      to: 'user@example.com',
      subject: 'Invoice',
      html: '<p>Attached.</p>',
      attachments: [{ filename: 'invoice.pdf', content: 'base64data', content_type: 'application/pdf' }],
    });

    const body = JSON.parse(requests[0].options.body);
    expect(body.attachments).toHaveLength(1);
    expect(body.attachments[0].filename).toBe('invoice.pdf');
  });

  it('send() with scheduled_at', async () => {
    const { client } = mockClient([
      jsonResponse(201, { object: 'email', id: 'em_sched', status: 'scheduled', scheduled_at: '2026-01-10T09:00:00Z' }),
    ]);

    const email = await client.emails.send({
      from: 'hello@example.com',
      to: 'user@example.com',
      subject: 'Reminder',
      html: '<p>Tomorrow.</p>',
      scheduled_at: '2026-01-10T09:00:00Z',
    });

    expect(email.status).toBe('scheduled');
    expect(email.scheduled_at).toBe('2026-01-10T09:00:00Z');
  });

  it('send() with tracking options', async () => {
    const { client, requests } = mockClient([
      jsonResponse(201, { object: 'email', id: 'em_track', status: 'pending' }),
    ]);

    await client.emails.send({
      from: 'hello@example.com',
      to: 'user@example.com',
      subject: 'Track me',
      html: '<p>Hi</p>',
      tracking: { opens: true, clicks: true },
    });

    const body = JSON.parse(requests[0].options.body);
    expect(body.tracking).toEqual({ opens: true, clicks: true });
  });

  // ── list() ──

  it('list() returns a Collection', async () => {
    const responseBody = {
      data: [
        { object: 'email', id: 'em_1', status: 'delivered' },
        { object: 'email', id: 'em_2', status: 'pending' },
      ],
      next_page_url: '/v2/emails?page=2&limit=10',
      previous_page_url: null,
    };

    const { client, requests } = mockClient([jsonResponse(200, responseBody)]);

    const list = await client.emails.list({ page: 1, limit: 10 });

    expect(list).toBeInstanceOf(Collection);
    expect(list.count).toBe(2);
    expect(list.hasMore()).toBe(true);
    expect(list.getData()[0].id).toBe('em_1');
    expect(list.getData()[1].id).toBe('em_2');

    expect(requests[0].url).toContain('page=1');
    expect(requests[0].url).toContain('limit=10');
    expect(requests[0].options.method).toBe('GET');
  });

  it('list() without params sends no query string', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { data: [], next_page_url: null }),
    ]);

    await client.emails.list();
    expect(requests[0].url).toMatch(/\/v2\/emails$/);
  });

  // ── get(), getRaw(), getAttachments(), getBody(), getMeta() ──

  it('get() returns a typed resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'email', id: 'em_abc', status: 'delivered' }),
    ]);

    const email = await client.emails.get('em_abc');
    expect(email.id).toBe('em_abc');
    expect(requests[0].url).toContain('/v2/emails/em_abc');
    expect(requests[0].options.method).toBe('GET');
  });

  it('getRaw() returns resource with raw property', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'email', id: 'em_abc', raw: 'MIME data...' }),
    ]);

    const email = await client.emails.getRaw('em_abc');
    expect(email.raw).toBe('MIME data...');
    expect(requests[0].url).toContain('/v2/emails/em_abc/raw');
  });

  it('getAttachments() returns a Collection', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, {
        data: [{ filename: 'invoice.pdf' }],
        next_page_url: null,
      }),
    ]);

    const attachments = await client.emails.getAttachments('em_abc');
    expect(attachments).toBeInstanceOf(Collection);
    expect(attachments.count).toBe(1);
    expect(requests[0].url).toContain('/v2/emails/em_abc/attachments');
  });

  it('getBody() returns object with text and html', async () => {
    const { client } = mockClient([
      jsonResponse(200, { text: 'Hello', html: '<p>Hello</p>' }),
    ]);

    const body = await client.emails.getBody('em_abc');
    expect(body.text).toBe('Hello');
    expect(body.html).toBe('<p>Hello</p>');
  });

  it('getMeta() returns resource with headers', async () => {
    const { client } = mockClient([
      jsonResponse(200, { object: 'email', id: 'em_abc', headers: { 'X-Custom': 'val' } }),
    ]);

    const meta = await client.emails.getMeta('em_abc');
    expect(meta.headers).toEqual({ 'X-Custom': 'val' });
  });

  // ── update(), cancel(), retry() ──

  it('update() returns updated resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'email', id: 'em_abc', status: 'scheduled', scheduled_at: '2026-02-01T00:00:00Z' }),
    ]);

    const email = await client.emails.update('em_abc', { scheduled_at: '2026-02-01T00:00:00Z' });
    expect(email.scheduled_at).toBe('2026-02-01T00:00:00Z');
    expect(requests[0].options.method).toBe('POST');
  });

  it('cancel() returns canceled resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'email', id: 'em_abc', status: 'canceled' }),
    ]);

    const email = await client.emails.cancel('em_abc');
    expect(email.status).toBe('canceled');
    expect(requests[0].url).toContain('/v2/emails/em_abc/cancel');
    expect(requests[0].options.method).toBe('POST');
  });

  it('retry() returns new resource', async () => {
    const { client, requests } = mockClient([
      jsonResponse(201, { object: 'email', id: 'em_new', original_id: 'em_abc', status: 'pending' }),
    ]);

    const email = await client.emails.retry('em_abc');
    expect(email.id).toBe('em_new');
    expect(email.original_id).toBe('em_abc');
    expect(requests[0].url).toContain('/v2/emails/em_abc/retry');
  });

  // ── Resource features ──

  it('resource supports toArray()', async () => {
    const data = { object: 'email', id: 'em_1', status: 'pending' };
    const { client } = mockClient([jsonResponse(200, data)]);

    const email = await client.emails.get('em_1');
    expect(email.toArray()).toEqual(data);
  });

  it('resource is JSON serializable', async () => {
    const data = { object: 'email', id: 'em_1' };
    const { client } = mockClient([jsonResponse(200, data)]);

    const email = await client.emails.get('em_1');
    expect(JSON.parse(JSON.stringify(email))).toEqual(data);
  });

  it('getLastResponse() returns the underlying ApiResponse', async () => {
    const { client } = mockClient([jsonResponse(200, { id: 'em_1' })]);

    const email = await client.emails.get('em_1');
    const resp = email.getLastResponse();
    expect(resp.statusCode).toBe(200);
  });

  it('Collection is iterable', async () => {
    const { client } = mockClient([
      jsonResponse(200, {
        data: [{ id: 'em_1' }, { id: 'em_2' }],
        next_page_url: null,
      }),
    ]);

    const list = await client.emails.list();
    const ids = [];
    for (const item of list) {
      ids.push(item.id);
    }
    expect(ids).toEqual(['em_1', 'em_2']);
  });

  // ── URL encoding ──

  it('email id is url-encoded in path', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'email', id: 'em_with spaces' }),
    ]);

    await client.emails.get('em_with spaces');
    expect(requests[0].url).toContain('/v2/emails/em_with%20spaces');
  });

  // ── Error handling ──

  it('401 throws AuthenticationException', async () => {
    const { client } = mockClient([
      jsonResponse(401, { error: 'Unauthorized', message: 'Invalid API key' }),
    ]);

    await expect(client.emails.list()).rejects.toThrow(AuthenticationException);
    await expect(mockClient([
      jsonResponse(401, { error: 'Unauthorized', message: 'Invalid API key' }),
    ]).client.emails.list()).rejects.toThrow('Unauthorized: Invalid API key');
  });

  it('400 throws InvalidRequestException', async () => {
    const { client } = mockClient([
      jsonResponse(400, { error: 'Bad Request' }),
    ]);
    await expect(client.emails.send({})).rejects.toThrow(InvalidRequestException);
  });

  it('404 throws InvalidRequestException', async () => {
    const { client } = mockClient([
      jsonResponse(404, { error: 'Email not found', message: 'Not found in workspace' }),
    ]);
    await expect(client.emails.get('em_nonexistent')).rejects.toThrow(InvalidRequestException);
  });

  it('422 throws UnprocessableEntityException', async () => {
    const { client } = mockClient([
      jsonResponse(422, { error: 'Validation failed' }),
    ]);
    await expect(client.emails.send({})).rejects.toThrow(UnprocessableEntityException);
  });

  it('429 throws RateLimitException', async () => {
    const { client } = mockClient([
      jsonResponse(429, { error: 'Too many requests' }),
    ]);
    await expect(client.emails.list()).rejects.toThrow(RateLimitException);
  });

  it('error exception carries full response data', async () => {
    const errorBody = { error: 'Email not found', message: 'Not found in workspace' };
    const { client } = mockClient([
      jsonResponse(404, errorBody, { 'x-request-id': 'req_test123' }),
    ]);

    try {
      await client.emails.get('em_nonexistent');
      expect.unreachable('Should have thrown');
    } catch (e) {
      expect(e).toBeInstanceOf(InvalidRequestException);
      expect(e.httpStatus).toBe(404);
      expect(e.jsonBody).toEqual(errorBody);
      expect(e.httpBody).toBe(JSON.stringify(errorBody));
      expect(e.httpHeaders).toHaveProperty('x-request-id');
    }
  });

  it('nested error format is extracted', async () => {
    const { client } = mockClient([
      jsonResponse(400, {
        error: { type: 'validation_error', message: 'The recipient email address is invalid', param: 'to' },
      }),
    ]);

    try {
      await client.emails.send({});
      expect.unreachable('Should have thrown');
    } catch (e) {
      expect(e.message).toBe('The recipient email address is invalid');
    }
  });

  it('non-json error body uses fallback message', async () => {
    const { client } = mockClient([{
      status: 502,
      body: 'Bad Gateway',
      headers: {},
    }]);

    try {
      await client.emails.list();
      expect.unreachable('Should have thrown');
    } catch (e) {
      expect(e.message).toBe('API request failed with status 502');
      expect(e.httpBody).toBe('Bad Gateway');
    }
  });
});
