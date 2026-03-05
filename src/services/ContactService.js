import { AbstractService } from './AbstractService.js';

export class ContactService extends AbstractService {
  async create(params) {
    return this._request('POST', '/v2/contacts', params);
  }

  async get(id) {
    return this._request('GET', this._buildPath('/v2/contacts/%s', id));
  }

  async update(id, params) {
    return this._request('POST', this._buildPath('/v2/contacts/%s', id), params);
  }

  async list(params = null) {
    return this._requestCollection('GET', '/v2/contacts', params);
  }

  async delete(id) {
    return this._request('DELETE', this._buildPath('/v2/contacts/%s', id));
  }
}
