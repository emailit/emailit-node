import { WebhookEvent } from './WebhookEvent.js';

class EmailAccepted extends WebhookEvent {}
EmailAccepted.EVENT_TYPE = 'email.accepted';

class EmailScheduled extends WebhookEvent {}
EmailScheduled.EVENT_TYPE = 'email.scheduled';

class EmailDelivered extends WebhookEvent {}
EmailDelivered.EVENT_TYPE = 'email.delivered';

class EmailBounced extends WebhookEvent {}
EmailBounced.EVENT_TYPE = 'email.bounced';

class EmailAttempted extends WebhookEvent {}
EmailAttempted.EVENT_TYPE = 'email.attempted';

class EmailFailed extends WebhookEvent {}
EmailFailed.EVENT_TYPE = 'email.failed';

class EmailRejected extends WebhookEvent {}
EmailRejected.EVENT_TYPE = 'email.rejected';

class EmailSuppressed extends WebhookEvent {}
EmailSuppressed.EVENT_TYPE = 'email.suppressed';

class EmailReceived extends WebhookEvent {}
EmailReceived.EVENT_TYPE = 'email.received';

class EmailComplained extends WebhookEvent {}
EmailComplained.EVENT_TYPE = 'email.complained';

class EmailClicked extends WebhookEvent {}
EmailClicked.EVENT_TYPE = 'email.clicked';

class EmailLoaded extends WebhookEvent {}
EmailLoaded.EVENT_TYPE = 'email.loaded';

class DomainCreated extends WebhookEvent {}
DomainCreated.EVENT_TYPE = 'domain.created';

class DomainUpdated extends WebhookEvent {}
DomainUpdated.EVENT_TYPE = 'domain.updated';

class DomainDeleted extends WebhookEvent {}
DomainDeleted.EVENT_TYPE = 'domain.deleted';

class AudienceCreated extends WebhookEvent {}
AudienceCreated.EVENT_TYPE = 'audience.created';

class AudienceUpdated extends WebhookEvent {}
AudienceUpdated.EVENT_TYPE = 'audience.updated';

class AudienceDeleted extends WebhookEvent {}
AudienceDeleted.EVENT_TYPE = 'audience.deleted';

class SubscriberCreated extends WebhookEvent {}
SubscriberCreated.EVENT_TYPE = 'subscriber.created';

class SubscriberUpdated extends WebhookEvent {}
SubscriberUpdated.EVENT_TYPE = 'subscriber.updated';

class SubscriberDeleted extends WebhookEvent {}
SubscriberDeleted.EVENT_TYPE = 'subscriber.deleted';

class ContactCreated extends WebhookEvent {}
ContactCreated.EVENT_TYPE = 'contact.created';

class ContactUpdated extends WebhookEvent {}
ContactUpdated.EVENT_TYPE = 'contact.updated';

class ContactDeleted extends WebhookEvent {}
ContactDeleted.EVENT_TYPE = 'contact.deleted';

class TemplateCreated extends WebhookEvent {}
TemplateCreated.EVENT_TYPE = 'template.created';

class TemplateUpdated extends WebhookEvent {}
TemplateUpdated.EVENT_TYPE = 'template.updated';

class TemplateDeleted extends WebhookEvent {}
TemplateDeleted.EVENT_TYPE = 'template.deleted';

class SuppressionCreated extends WebhookEvent {}
SuppressionCreated.EVENT_TYPE = 'suppression.created';

class SuppressionUpdated extends WebhookEvent {}
SuppressionUpdated.EVENT_TYPE = 'suppression.updated';

class SuppressionDeleted extends WebhookEvent {}
SuppressionDeleted.EVENT_TYPE = 'suppression.deleted';

class EmailVerificationCreated extends WebhookEvent {}
EmailVerificationCreated.EVENT_TYPE = 'email_verification.created';

class EmailVerificationUpdated extends WebhookEvent {}
EmailVerificationUpdated.EVENT_TYPE = 'email_verification.updated';

class EmailVerificationDeleted extends WebhookEvent {}
EmailVerificationDeleted.EVENT_TYPE = 'email_verification.deleted';

class EmailVerificationListCreated extends WebhookEvent {}
EmailVerificationListCreated.EVENT_TYPE = 'email_verification_list.created';

class EmailVerificationListUpdated extends WebhookEvent {}
EmailVerificationListUpdated.EVENT_TYPE = 'email_verification_list.updated';

class EmailVerificationListDeleted extends WebhookEvent {}
EmailVerificationListDeleted.EVENT_TYPE = 'email_verification_list.deleted';

const ALL_EVENT_CLASSES = [
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
];

const EVENT_MAP = {};
for (const cls of ALL_EVENT_CLASSES) {
  EVENT_MAP[cls.EVENT_TYPE] = cls;
}

WebhookEvent._eventMap = EVENT_MAP;

export {
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
};
