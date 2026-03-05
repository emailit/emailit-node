import { AbstractService } from './AbstractService.js';

export class EmailService extends AbstractService {
  async send(params) {
    return this._request('POST', '/v2/emails', params);
  }

  async list(params = null) {
    return this._requestCollection('GET', '/v2/emails', params);
  }

  async get(id) {
    return this._request('GET', this._buildPath('/v2/emails/%s', id));
  }

  async getRaw(id) {
    return this._request('GET', this._buildPath('/v2/emails/%s/raw', id));
  }

  async getAttachments(id) {
    return this._requestCollection('GET', this._buildPath('/v2/emails/%s/attachments', id));
  }

  async getBody(id) {
    return this._request('GET', this._buildPath('/v2/emails/%s/body', id));
  }

  async getMeta(id) {
    return this._request('GET', this._buildPath('/v2/emails/%s/meta', id));
  }

  async update(id, params) {
    return this._request('POST', this._buildPath('/v2/emails/%s', id), params);
  }

  async cancel(id) {
    return this._request('POST', this._buildPath('/v2/emails/%s/cancel', id));
  }

  async retry(id) {
    return this._request('POST', this._buildPath('/v2/emails/%s/retry', id));
  }
}
