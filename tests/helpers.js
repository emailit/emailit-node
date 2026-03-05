import { EmailitClient } from '../src/EmailitClient.js';

export function jsonResponse(status, body, headers = {}) {
  return {
    status,
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json', ...headers },
  };
}

export function rawResponse(status, body, headers = {}) {
  return {
    status,
    body,
    headers: { ...headers },
  };
}

export function mockClient(responses) {
  const queue = [...responses];
  const requests = [];

  const fakeFetch = async (url, options) => {
    const res = queue.shift();
    requests.push({ url, options });

    const headersMap = new Map(Object.entries(res.headers));

    return {
      status: res.status,
      text: async () => res.body,
      headers: {
        entries: () => headersMap.entries(),
      },
    };
  };

  const client = new EmailitClient({
    apiKey: 'em_test_key',
    fetch: fakeFetch,
  });

  return { client, requests };
}
