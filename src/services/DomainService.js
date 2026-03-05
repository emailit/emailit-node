import { AbstractService } from './AbstractService.js';

export class DomainService extends AbstractService {
  async create(params) {
    return this._request('POST', '/v2/domains', params);
  }

  async get(id) {
    return this._request('GET', this._buildPath('/v2/domains/%s', id));
  }

  async verify(id) {
    return this._request('POST', this._buildPath('/v2/domains/%s/verify', id));
  }

  async update(id, params) {
    return this._request('PATCH', this._buildPath('/v2/domains/%s', id), params);
  }

  async list(params = null) {
    return this._requestCollection('GET', '/v2/domains', params);
  }

  async delete(id) {
    return this._request('DELETE', this._buildPath('/v2/domains/%s', id));
  }
}
