import { ApiResponse } from './ApiResponse.js';
import { ApiConnectionException } from './errors/ApiConnectionException.js';
import { createApiError } from './errors/index.js';

const SDK_VERSION = '2.0.2';
const DEFAULT_API_BASE = 'https://api.emailit.com';
const DEFAULT_TIMEOUT = 30_000;

export class BaseEmailitClient {
  constructor(config) {
    if (typeof config === 'string') {
      config = { apiKey: config };
    }

    if (!config.apiKey) {
      throw new Error('apiKey is required');
    }

    this._apiKey = config.apiKey;
    this._apiBase = (config.apiBase || DEFAULT_API_BASE).replace(/\/+$/, '');
    this._timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this._fetch = config.fetch ?? globalThis.fetch;
  }

  get apiKey() {
    return this._apiKey;
  }

  get apiBase() {
    return this._apiBase;
  }

  async request(method, path, params = null) {
    const url = new URL(path, this._apiBase);

    const options = {
      method: method.toUpperCase(),
      headers: {
        'Authorization': `Bearer ${this._apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': `emailit-node/${SDK_VERSION}`,
      },
    };

    if (params !== null && params !== undefined) {
      if (options.method === 'GET') {
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== null) {
            url.searchParams.set(key, String(value));
          }
        }
      } else {
        options.body = JSON.stringify(params);
      }
    }

    const controller = new AbortController();
    options.signal = controller.signal;
    const timer = setTimeout(() => controller.abort(), this._timeout);

    let response;
    try {
      response = await this._fetch(url.toString(), options);
    } catch (err) {
      clearTimeout(timer);
      throw new ApiConnectionException(
        `Could not connect to the Emailit API: ${err.message}`,
      );
    }
    clearTimeout(timer);

    const body = await response.text();
    const headers = Object.fromEntries(response.headers.entries());
    const apiResponse = new ApiResponse(response.status, headers, body);

    if (response.status >= 400) {
      this._handleErrorResponse(apiResponse);
    }

    return apiResponse;
  }

  _handleErrorResponse(response) {
    const message = this._extractErrorMessage(response);
    throw createApiError(
      message,
      response.statusCode,
      response.body,
      response.json,
      response.headers,
    );
  }

  _extractErrorMessage(response) {
    if (response.json !== null && response.json !== undefined) {
      if (typeof response.json.error === 'string') {
        let msg = response.json.error;
        if (response.json.message) {
          msg += ': ' + response.json.message;
        }
        return msg;
      }
      if (response.json.error && response.json.error.message) {
        return response.json.error.message;
      }
    }
    return `API request failed with status ${response.statusCode}`;
  }
}

export { DEFAULT_API_BASE, SDK_VERSION };
