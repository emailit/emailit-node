import { describe, it, expect } from 'vitest';
import { EmailitClient } from '../src/EmailitClient.js';
import { EmailService } from '../src/services/EmailService.js';
import { DomainService } from '../src/services/DomainService.js';
import { ApiKeyService } from '../src/services/ApiKeyService.js';
import { WebhookService } from '../src/services/WebhookService.js';
import { AudienceService } from '../src/services/AudienceService.js';
import { SubscriberService } from '../src/services/SubscriberService.js';
import { TemplateService } from '../src/services/TemplateService.js';
import { SuppressionService } from '../src/services/SuppressionService.js';
import { EmailVerificationService } from '../src/services/EmailVerificationService.js';
import { EmailVerificationListService } from '../src/services/EmailVerificationListService.js';
import { ContactService } from '../src/services/ContactService.js';
import { EventService } from '../src/services/EventService.js';

describe('CoreServiceFactory', () => {
  const client = new EmailitClient('em_test_key');

  it('emails returns EmailService', () => {
    expect(client.emails).toBeInstanceOf(EmailService);
  });

  it('domains returns DomainService', () => {
    expect(client.domains).toBeInstanceOf(DomainService);
  });

  it('apiKeys returns ApiKeyService', () => {
    expect(client.apiKeys).toBeInstanceOf(ApiKeyService);
  });

  it('webhooks returns WebhookService', () => {
    expect(client.webhooks).toBeInstanceOf(WebhookService);
  });

  it('audiences returns AudienceService', () => {
    expect(client.audiences).toBeInstanceOf(AudienceService);
  });

  it('subscribers returns SubscriberService', () => {
    expect(client.subscribers).toBeInstanceOf(SubscriberService);
  });

  it('templates returns TemplateService', () => {
    expect(client.templates).toBeInstanceOf(TemplateService);
  });

  it('suppressions returns SuppressionService', () => {
    expect(client.suppressions).toBeInstanceOf(SuppressionService);
  });

  it('emailVerifications returns EmailVerificationService', () => {
    expect(client.emailVerifications).toBeInstanceOf(EmailVerificationService);
  });

  it('emailVerificationLists returns EmailVerificationListService', () => {
    expect(client.emailVerificationLists).toBeInstanceOf(EmailVerificationListService);
  });

  it('contacts returns ContactService', () => {
    expect(client.contacts).toBeInstanceOf(ContactService);
  });

  it('events returns EventService', () => {
    expect(client.events).toBeInstanceOf(EventService);
  });

  it('services are cached (same instance)', () => {
    expect(client.emails).toBe(client.emails);
    expect(client.domains).toBe(client.domains);
    expect(client.contacts).toBe(client.contacts);
  });
});
