import { EmailitObject } from '../EmailitObject.js';

export class WebhookEvent extends EmailitObject {
  static EVENT_TYPE = '';

  static _eventMap = {};

  static constructFrom(payload) {
    const type = payload.type || null;

    if (type !== null && WebhookEvent._eventMap[type]) {
      return new WebhookEvent._eventMap[type](payload);
    }

    return new WebhookEvent(payload);
  }

  getEventData() {
    const data = this._values.data;
    if (!data) return null;
    return data.object || data;
  }
}
