import { EmailitClient } from './EmailitClient.js';

export const VERSION = '2.0.1';

export class Emailit extends EmailitClient {
  constructor(config) {
    super(config);
  }
}

export { EmailitClient } from './EmailitClient.js';
export { BaseEmailitClient, DEFAULT_API_BASE } from './BaseEmailitClient.js';
export { ApiResponse } from './ApiResponse.js';
export { EmailitObject } from './EmailitObject.js';
export { Collection } from './Collection.js';
export { WebhookSignature } from './WebhookSignature.js';

export {
  ApiErrorException,
  ApiConnectionException,
  AuthenticationException,
  InvalidRequestException,
  RateLimitException,
  UnprocessableEntityException,
} from './errors/index.js';

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
} from './events/index.js';
