import { describe, it, expect } from 'vitest';
import { Emailit, EmailitClient, DEFAULT_API_BASE, VERSION } from '../src/index.js';
import { EmailService } from '../src/services/EmailService.js';

describe('EmailitClient', () => {
  it('accepts string api key', () => {
    const client = new EmailitClient('em_test_abc');
    expect(client.apiKey).toBe('em_test_abc');
    expect(client.apiBase).toBe(DEFAULT_API_BASE);
  });

  it('accepts config object', () => {
    const client = new EmailitClient({
      apiKey: 'em_test_xyz',
      apiBase: 'https://custom.emailit.com',
    });
    expect(client.apiKey).toBe('em_test_xyz');
    expect(client.apiBase).toBe('https://custom.emailit.com');
  });

  it('strips trailing slash from apiBase', () => {
    const client = new EmailitClient({
      apiKey: 'em_test_key',
      apiBase: 'https://api.emailit.com/',
    });
    expect(client.apiBase).toBe('https://api.emailit.com');
  });

  it('throws on missing apiKey', () => {
    expect(() => new EmailitClient({})).toThrow('apiKey is required');
  });

  it('throws on empty string apiKey', () => {
    expect(() => new EmailitClient('')).toThrow('apiKey is required');
  });

  it('emails getter returns EmailService', () => {
    const client = new EmailitClient('em_test_key');
    expect(client.emails).toBeInstanceOf(EmailService);
  });

  it('service is cached across accesses', () => {
    const client = new EmailitClient('em_test_key');
    const first = client.emails;
    const second = client.emails;
    expect(first).toBe(second);
  });
});

describe('Emailit', () => {
  it('constructor returns an EmailitClient', () => {
    const emailit = new Emailit('em_test_facade');
    expect(emailit).toBeInstanceOf(EmailitClient);
    expect(emailit.apiKey).toBe('em_test_facade');
  });

  it('VERSION is defined', () => {
    expect(VERSION).toBe('2.0.0');
  });
});
