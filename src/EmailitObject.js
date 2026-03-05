export class EmailitObject {
  constructor(values = {}) {
    this._values = { ...values };
    this._lastResponse = null;

    return new Proxy(this, {
      get(target, prop, receiver) {
        if (prop in target || typeof prop === 'symbol') {
          return Reflect.get(target, prop, receiver);
        }
        return target._values[prop];
      },
      set(target, prop, value) {
        if (prop === '_values' || prop === '_lastResponse') {
          target[prop] = value;
          return true;
        }
        target._values[prop] = value;
        return true;
      },
      has(target, prop) {
        return prop in target || prop in target._values;
      },
    });
  }

  toArray() {
    return { ...this._values };
  }

  toJSON() {
    return this.toArray();
  }

  refreshFrom(values) {
    this._values = { ...values };
    return this;
  }

  getLastResponse() {
    return this._lastResponse;
  }

  setLastResponse(response) {
    this._lastResponse = response;
    return this;
  }
}
