import { BaseEmailitClient } from './BaseEmailitClient.js';
import { CoreServiceFactory } from './services/CoreServiceFactory.js';

export class EmailitClient extends BaseEmailitClient {
  constructor(config) {
    super(config);
    this._serviceFactory = new CoreServiceFactory(this);
  }

  get emails() {
    return this._serviceFactory.getService('emails');
  }

  get domains() {
    return this._serviceFactory.getService('domains');
  }

  get apiKeys() {
    return this._serviceFactory.getService('apiKeys');
  }

  get webhooks() {
    return this._serviceFactory.getService('webhooks');
  }

  get audiences() {
    return this._serviceFactory.getService('audiences');
  }

  get subscribers() {
    return this._serviceFactory.getService('subscribers');
  }

  get templates() {
    return this._serviceFactory.getService('templates');
  }

  get suppressions() {
    return this._serviceFactory.getService('suppressions');
  }

  get emailVerifications() {
    return this._serviceFactory.getService('emailVerifications');
  }

  get emailVerificationLists() {
    return this._serviceFactory.getService('emailVerificationLists');
  }

  get contacts() {
    return this._serviceFactory.getService('contacts');
  }

  get events() {
    return this._serviceFactory.getService('events');
  }
}
