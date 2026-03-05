import { AbstractService } from './AbstractService.js';

export class EmailVerificationListService extends AbstractService {
  async create(params) {
    return this._request('POST', '/v2/email-verification-lists', params);
  }

  async list(params = null) {
    return this._requestCollection('GET', '/v2/email-verification-lists', params);
  }

  async get(id) {
    return this._request('GET', this._buildPath('/v2/email-verification-lists/%s', id));
  }

  async results(id, params = null) {
    return this._requestCollection(
      'GET',
      this._buildPath('/v2/email-verification-lists/%s/results', id),
      params,
    );
  }

  async export(id) {
    return this._requestRaw(
      'GET',
      this._buildPath('/v2/email-verification-lists/%s/export', id),
    );
  }
}
