import { AbstractService } from './AbstractService.js';

export class WebhookService extends AbstractService {
  async create(params) {
    return this._request('POST', '/v2/webhooks', params);
  }

  async get(id) {
    return this._request('GET', this._buildPath('/v2/webhooks/%s', id));
  }

  async update(id, params) {
    return this._request('POST', this._buildPath('/v2/webhooks/%s', id), params);
  }

  async list(params = null) {
    return this._requestCollection('GET', '/v2/webhooks', params);
  }

  async delete(id) {
    return this._request('DELETE', this._buildPath('/v2/webhooks/%s', id));
  }
}
