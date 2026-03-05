import { AbstractService } from './AbstractService.js';

export class SubscriberService extends AbstractService {
  async create(audienceId, params) {
    return this._request(
      'POST',
      this._buildPath('/v2/audiences/%s/subscribers', audienceId),
      params,
    );
  }

  async get(audienceId, subscriberId) {
    return this._request(
      'GET',
      this._buildPath('/v2/audiences/%s/subscribers/%s', audienceId, subscriberId),
    );
  }

  async update(audienceId, subscriberId, params) {
    return this._request(
      'POST',
      this._buildPath('/v2/audiences/%s/subscribers/%s', audienceId, subscriberId),
      params,
    );
  }

  async list(audienceId, params = null) {
    return this._requestCollection(
      'GET',
      this._buildPath('/v2/audiences/%s/subscribers', audienceId),
      params,
    );
  }

  async delete(audienceId, subscriberId) {
    return this._request(
      'DELETE',
      this._buildPath('/v2/audiences/%s/subscribers/%s', audienceId, subscriberId),
    );
  }
}
