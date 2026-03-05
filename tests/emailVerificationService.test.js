import { describe, it, expect } from 'vitest';
import { mockClient, jsonResponse } from './helpers.js';

describe('EmailVerificationService', () => {
  it('verify() sends POST and returns result', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, {
        object: 'email_verification',
        email: 'test@example.com',
        status: 'valid',
        score: 0.95,
        risk: 'low',
      }),
    ]);

    const result = await client.emailVerifications.verify({ email: 'test@example.com' });
    expect(result.status).toBe('valid');
    expect(result.score).toBe(0.95);
    expect(result.risk).toBe('low');
    expect(requests[0].options.method).toBe('POST');
    expect(requests[0].url).toContain('/v2/email-verifications');
  });

  it('verify() with mode param', async () => {
    const { client, requests } = mockClient([
      jsonResponse(200, { object: 'email_verification', email: 'test@example.com', status: 'valid' }),
    ]);

    await client.emailVerifications.verify({ email: 'test@example.com', mode: 'quick' });
    const body = JSON.parse(requests[0].options.body);
    expect(body.mode).toBe('quick');
  });
});
