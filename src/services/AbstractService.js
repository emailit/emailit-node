import { EmailitObject } from '../EmailitObject.js';
import { Collection } from '../Collection.js';

export class AbstractService {
  constructor(client) {
    this._client = client;
  }

  async _request(method, path, params = null) {
    const response = await this._client.request(method, path, params);
    const obj = convertToEmailitObject(response.json);
    if (obj) {
      obj.setLastResponse(response);
    }
    return obj;
  }

  async _requestCollection(method, path, params = null) {
    const response = await this._client.request(method, path, params);
    const collection = convertToCollection(response.json);
    collection.setLastResponse(response);
    return collection;
  }

  async _requestRaw(method, path, params = null) {
    return this._client.request(method, path, params);
  }

  _buildPath(pattern, ...args) {
    let i = 0;
    return pattern.replace(/%s/g, () => encodeURIComponent(args[i++]));
  }
}

function convertToEmailitObject(data) {
  if (data === null || data === undefined) {
    return null;
  }

  if (Array.isArray(data.data)) {
    data.data = data.data.map((item) => convertToEmailitObject(item));
    return new Collection(data);
  }

  return new EmailitObject(data);
}

function convertToCollection(data) {
  if (data === null || data === undefined) {
    return new Collection({});
  }

  if (Array.isArray(data.data)) {
    data.data = data.data.map((item) => convertToEmailitObject(item));
  }

  return new Collection(data);
}
