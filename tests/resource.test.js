import { describe, it, expect } from 'vitest';
import { EmailitObject } from '../src/EmailitObject.js';
import { Collection } from '../src/Collection.js';
import { ApiResponse } from '../src/ApiResponse.js';

describe('EmailitObject', () => {
  it('supports property access', () => {
    const obj = new EmailitObject({ id: 'em_1', status: 'pending' });
    expect(obj.id).toBe('em_1');
    expect(obj.status).toBe('pending');
  });

  it('returns undefined for missing properties', () => {
    const obj = new EmailitObject({});
    expect(obj.nonexistent).toBeUndefined();
  });

  it('supports property setting', () => {
    const obj = new EmailitObject({});
    obj.name = 'test';
    expect(obj.name).toBe('test');
  });

  it('supports toArray()', () => {
    const data = { id: 'em_1', status: 'pending' };
    const obj = new EmailitObject(data);
    expect(obj.toArray()).toEqual(data);
  });

  it('supports toJSON()', () => {
    const data = { id: 'em_1' };
    const obj = new EmailitObject(data);
    expect(JSON.stringify(obj)).toBe('{"id":"em_1"}');
  });

  it('supports refreshFrom()', () => {
    const obj = new EmailitObject({ id: 'old' });
    obj.refreshFrom({ id: 'new' });
    expect(obj.id).toBe('new');
  });

  it('tracks last response', () => {
    const obj = new EmailitObject({});
    expect(obj.getLastResponse()).toBeNull();

    const response = new ApiResponse(200, {}, '{}');
    obj.setLastResponse(response);
    expect(obj.getLastResponse()).toBe(response);
  });

  it('supports "in" operator', () => {
    const obj = new EmailitObject({ id: 'em_1' });
    expect('id' in obj).toBe(true);
    expect('missing' in obj).toBe(false);
  });
});

describe('Collection', () => {
  it('returns data items', () => {
    const items = [
      new EmailitObject({ id: 'em_1' }),
      new EmailitObject({ id: 'em_2' }),
    ];
    const col = new Collection({ data: items, next_page_url: null });
    expect(col.getData()).toHaveLength(2);
    expect(col.count).toBe(2);
  });

  it('hasMore() returns true when next_page_url is set', () => {
    const col = new Collection({ data: [], next_page_url: '/v2/emails?page=2' });
    expect(col.hasMore()).toBe(true);
  });

  it('hasMore() returns false when next_page_url is null', () => {
    const col = new Collection({ data: [], next_page_url: null });
    expect(col.hasMore()).toBe(false);
  });

  it('is iterable', () => {
    const items = [
      new EmailitObject({ id: 'em_1' }),
      new EmailitObject({ id: 'em_2' }),
    ];
    const col = new Collection({ data: items, next_page_url: null });

    const ids = [];
    for (const item of col) {
      ids.push(item.id);
    }
    expect(ids).toEqual(['em_1', 'em_2']);
  });

  it('returns empty array when no data', () => {
    const col = new Collection({});
    expect(col.getData()).toEqual([]);
    expect(col.count).toBe(0);
  });
});
