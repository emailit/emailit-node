import { describe, it, expect, vi } from 'vitest';
import { WebhookSignature } from '../src/WebhookSignature.js';
import { ApiErrorException } from '../src/errors/ApiErrorException.js';
import { EmailDelivered } from '../src/events/index.js';

describe('WebhookSignature', () => {
  const secret = 'whsec_test_secret';
  const payload = { type: 'email.delivered', event_id: 'evt_1', data: { email_id: 'em_1' } };
  const rawBody = JSON.stringify(payload);
  const timestamp = String(Math.floor(Date.now() / 1000));
  const signature = WebhookSignature.computeSignature(rawBody, timestamp, secret);

  it('verify() returns typed WebhookEvent', () => {
    const event = WebhookSignature.verify(rawBody, signature, timestamp, secret);
    expect(event).toBeInstanceOf(EmailDelivered);
    expect(event.type).toBe('email.delivered');
    expect(event.event_id).toBe('evt_1');
  });

  it('verify() throws on invalid signature', () => {
    expect(() => {
      WebhookSignature.verify(rawBody, 'invalid_sig', timestamp, secret);
    }).toThrow('Webhook signature verification failed.');
  });

  it('verify() throws on old timestamp', () => {
    const oldTimestamp = String(Math.floor(Date.now() / 1000) - 600);
    const oldSig = WebhookSignature.computeSignature(rawBody, oldTimestamp, secret);

    expect(() => {
      WebhookSignature.verify(rawBody, oldSig, oldTimestamp, secret);
    }).toThrow('Webhook timestamp is too old.');
  });

  it('verify() skips timestamp check when tolerance is null', () => {
    const oldTimestamp = String(Math.floor(Date.now() / 1000) - 99999);
    const oldSig = WebhookSignature.computeSignature(rawBody, oldTimestamp, secret);

    const event = WebhookSignature.verify(rawBody, oldSig, oldTimestamp, secret, null);
    expect(event.type).toBe('email.delivered');
  });

  it('verify() uses custom tolerance', () => {
    const recentTimestamp = String(Math.floor(Date.now() / 1000) - 5);
    const sig = WebhookSignature.computeSignature(rawBody, recentTimestamp, secret);

    const event = WebhookSignature.verify(rawBody, sig, recentTimestamp, secret, 10);
    expect(event.type).toBe('email.delivered');
  });

  it('verify() throws on invalid JSON body', () => {
    const badBody = 'not json';
    const ts = String(Math.floor(Date.now() / 1000));
    const sig = WebhookSignature.computeSignature(badBody, ts, secret);

    expect(() => {
      WebhookSignature.verify(badBody, sig, ts, secret);
    }).toThrow('Invalid webhook payload.');
  });

  it('computeSignature() produces consistent output', () => {
    const sig1 = WebhookSignature.computeSignature('body', '12345', 'secret');
    const sig2 = WebhookSignature.computeSignature('body', '12345', 'secret');
    expect(sig1).toBe(sig2);
    expect(typeof sig1).toBe('string');
    expect(sig1.length).toBe(64);
  });

  it('constants are defined', () => {
    expect(WebhookSignature.HEADER_SIGNATURE).toBe('x-emailit-signature');
    expect(WebhookSignature.HEADER_TIMESTAMP).toBe('x-emailit-timestamp');
    expect(WebhookSignature.DEFAULT_TOLERANCE).toBe(300);
  });

  it('verify() throws ApiErrorException subclass', () => {
    expect(() => {
      WebhookSignature.verify(rawBody, 'bad', timestamp, secret);
    }).toThrow(ApiErrorException);
  });
});
