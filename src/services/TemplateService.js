import { AbstractService } from './AbstractService.js';

export class TemplateService extends AbstractService {
  async create(params) {
    return this._request('POST', '/v2/templates', params);
  }

  async get(id) {
    return this._request('GET', this._buildPath('/v2/templates/%s', id));
  }

  async update(id, params) {
    return this._request('POST', this._buildPath('/v2/templates/%s', id), params);
  }

  async list(params = null) {
    return this._requestCollection('GET', '/v2/templates', params);
  }

  async delete(id) {
    return this._request('DELETE', this._buildPath('/v2/templates/%s', id));
  }

  async publish(id) {
    return this._request('POST', this._buildPath('/v2/templates/%s/publish', id));
  }
}
