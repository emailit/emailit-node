import { AbstractService } from './AbstractService.js';

export class EventService extends AbstractService {
  async list(params = null) {
    return this._requestCollection('GET', '/v2/events', params);
  }

  async get(id) {
    return this._request('GET', this._buildPath('/v2/events/%s', id));
  }
}
