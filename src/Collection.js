import { EmailitObject } from './EmailitObject.js';

export class Collection extends EmailitObject {
  getData() {
    return this._values.data || [];
  }

  get count() {
    return this.getData().length;
  }

  hasMore() {
    return this._values.next_page_url !== null && this._values.next_page_url !== undefined;
  }

  [Symbol.iterator]() {
    return this.getData()[Symbol.iterator]();
  }
}
