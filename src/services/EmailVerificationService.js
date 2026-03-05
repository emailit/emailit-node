import { AbstractService } from './AbstractService.js';

export class EmailVerificationService extends AbstractService {
  async verify(params) {
    return this._request('POST', '/v2/email-verifications', params);
  }
}
