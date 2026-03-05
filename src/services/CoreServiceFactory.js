import { EmailService } from './EmailService.js';
import { DomainService } from './DomainService.js';
import { ApiKeyService } from './ApiKeyService.js';
import { WebhookService } from './WebhookService.js';
import { AudienceService } from './AudienceService.js';
import { SubscriberService } from './SubscriberService.js';
import { TemplateService } from './TemplateService.js';
import { SuppressionService } from './SuppressionService.js';
import { EmailVerificationService } from './EmailVerificationService.js';
import { EmailVerificationListService } from './EmailVerificationListService.js';
import { ContactService } from './ContactService.js';
import { EventService } from './EventService.js';

const SERVICE_MAP = {
  emails: EmailService,
  domains: DomainService,
  apiKeys: ApiKeyService,
  webhooks: WebhookService,
  audiences: AudienceService,
  subscribers: SubscriberService,
  templates: TemplateService,
  suppressions: SuppressionService,
  emailVerifications: EmailVerificationService,
  emailVerificationLists: EmailVerificationListService,
  contacts: ContactService,
  events: EventService,
};

export class CoreServiceFactory {
  constructor(client) {
    this._client = client;
    this._cache = {};
  }

  getService(name) {
    if (!this._cache[name]) {
      const ServiceClass = SERVICE_MAP[name];
      if (!ServiceClass) {
        throw new Error(`Unknown service: ${name}`);
      }
      this._cache[name] = new ServiceClass(this._client);
    }
    return this._cache[name];
  }
}
