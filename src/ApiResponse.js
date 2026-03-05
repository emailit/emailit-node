export class ApiResponse {
  constructor(statusCode, headers, body) {
    this.statusCode = statusCode;
    this.headers = headers;
    this.body = body;

    let json = null;
    try {
      json = JSON.parse(body);
    } catch {
      // not JSON
    }
    this.json = json;
  }
}
