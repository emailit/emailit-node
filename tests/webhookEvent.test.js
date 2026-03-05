import { describe, it, expect } from 'vitest';
import {
  WebhookEvent,
  EmailAccepted, EmailScheduled, EmailDelivered, EmailBounced,
  EmailAttempted, EmailFailed, EmailRejected, EmailSuppressed,
  EmailReceived, EmailComplained, EmailClicked, EmailLoaded,
  DomainCreated, DomainUpdated, DomainDeleted,
  AudienceCreated, AudienceUpdated, AudienceDeleted,
  SubscriberCreated, SubscriberUpdated, SubscriberDeleted,
  ContactCreated, ContactUpdated, ContactDeleted,
  TemplateCreated, TemplateUpdated, TemplateDeleted,
  SuppressionCreated, SuppressionUpdated, SuppressionDeleted,
  EmailVerificationCreated, EmailVerificationUpdated, EmailVerificationDeleted,
  EmailVerificationListCreated, EmailVerificationListUpdated, EmailVerificationListDeleted,
} from '../src/events/index.js';

describe('WebhookEvent', () => {
  const eventMapping = [
    ['email.accepted', EmailAccepted],
    ['email.scheduled', EmailScheduled],
    ['email.delivered', EmailDelivered],
    ['email.bounced', EmailBounced],
    ['email.attempted', EmailAttempted],
    ['email.failed', EmailFailed],
    ['email.rejected', EmailRejected],
    ['email.suppressed', EmailSuppressed],
    ['email.received', EmailReceived],
    ['email.complained', EmailComplained],
    ['email.clicked', EmailClicked],
    ['email.loaded', EmailLoaded],
    ['domain.created', DomainCreated],
    ['domain.updated', DomainUpdated],
    ['domain.deleted', DomainDeleted],
    ['audience.created', AudienceCreated],
    ['audience.updated', AudienceUpdated],
    ['audience.deleted', AudienceDeleted],
    ['subscriber.created', SubscriberCreated],
    ['subscriber.updated', SubscriberUpdated],
    ['subscriber.deleted', SubscriberDeleted],
    ['contact.created', ContactCreated],
    ['contact.updated', ContactUpdated],
    ['contact.deleted', ContactDeleted],
    ['template.created', TemplateCreated],
    ['template.updated', TemplateUpdated],
    ['template.deleted', TemplateDeleted],
    ['suppression.created', SuppressionCreated],
    ['suppression.updated', SuppressionUpdated],
    ['suppression.deleted', SuppressionDeleted],
    ['email_verification.created', EmailVerificationCreated],
    ['email_verification.updated', EmailVerificationUpdated],
    ['email_verification.deleted', EmailVerificationDeleted],
    ['email_verification_list.created', EmailVerificationListCreated],
    ['email_verification_list.updated', EmailVerificationListUpdated],
    ['email_verification_list.deleted', EmailVerificationListDeleted],
  ];

  it.each(eventMapping)('constructFrom maps %s to %s', (type, EventClass) => {
    const event = WebhookEvent.constructFrom({ type, event_id: 'evt_1', data: { id: 'test' } });
    expect(event).toBeInstanceOf(EventClass);
    expect(event).toBeInstanceOf(WebhookEvent);
    expect(event.type).toBe(type);
  });

  it('constructFrom returns generic WebhookEvent for unknown type', () => {
    const event = WebhookEvent.constructFrom({ type: 'unknown.event', event_id: 'evt_1' });
    expect(event).toBeInstanceOf(WebhookEvent);
    expect(event.type).toBe('unknown.event');
  });

  it('getEventData() returns data.object when present', () => {
    const event = WebhookEvent.constructFrom({
      type: 'email.delivered',
      data: { object: { id: 'em_1', status: 'delivered' } },
    });
    expect(event.getEventData()).toEqual({ id: 'em_1', status: 'delivered' });
  });

  it('getEventData() falls back to data', () => {
    const event = WebhookEvent.constructFrom({
      type: 'email.delivered',
      data: { email_id: 'em_1' },
    });
    expect(event.getEventData()).toEqual({ email_id: 'em_1' });
  });

  it('getEventData() returns null when no data', () => {
    const event = WebhookEvent.constructFrom({ type: 'email.delivered' });
    expect(event.getEventData()).toBeNull();
  });

  it('EVENT_TYPE constants are set correctly', () => {
    expect(EmailDelivered.EVENT_TYPE).toBe('email.delivered');
    expect(DomainCreated.EVENT_TYPE).toBe('domain.created');
    expect(ContactUpdated.EVENT_TYPE).toBe('contact.updated');
    expect(EmailVerificationListDeleted.EVENT_TYPE).toBe('email_verification_list.deleted');
  });

  it('event is JSON serializable', () => {
    const payload = { type: 'email.delivered', event_id: 'evt_1', data: { id: 'em_1' } };
    const event = WebhookEvent.constructFrom(payload);
    expect(JSON.parse(JSON.stringify(event))).toEqual(payload);
  });

  it('all 36 event types are mapped', () => {
    expect(eventMapping).toHaveLength(36);
  });
});
