import { AbstractService } from './AbstractService.js';

export class ApiKeyService extends AbstractService {
  async create(params) {
    return this._request('POST', '/v2/api-keys', params);
  }

  async get(id) {
    return this._request('GET', this._buildPath('/v2/api-keys/%s', id));
  }

  async list(params = null) {
    return this._requestCollection('GET', '/v2/api-keys', params);
  }

  async update(id, params) {
    return this._request('POST', this._buildPath('/v2/api-keys/%s', id), params);
  }

  async delete(id) {
    return this._request('DELETE', this._buildPath('/v2/api-keys/%s', id));
  }
}
