import { createHmac, timingSafeEqual } from 'node:crypto';
import { ApiErrorException } from './errors/ApiErrorException.js';
import { WebhookEvent } from './events/index.js';

const HEADER_SIGNATURE = 'x-emailit-signature';
const HEADER_TIMESTAMP = 'x-emailit-timestamp';
const DEFAULT_TOLERANCE = 300;

export class WebhookSignature {
  static HEADER_SIGNATURE = HEADER_SIGNATURE;
  static HEADER_TIMESTAMP = HEADER_TIMESTAMP;
  static DEFAULT_TOLERANCE = DEFAULT_TOLERANCE;

  static verify(rawBody, signature, timestamp, secret, tolerance = DEFAULT_TOLERANCE) {
    if (tolerance !== null && tolerance !== undefined) {
      const age = Math.floor(Date.now() / 1000) - Number(timestamp);
      if (age > tolerance) {
        throw new ApiErrorException(
          'Webhook timestamp is too old.',
          401,
        );
      }
    }

    const computed = WebhookSignature.computeSignature(rawBody, timestamp, secret);

    const sig = Buffer.from(signature, 'utf8');
    const comp = Buffer.from(computed, 'utf8');
    if (sig.length !== comp.length || !timingSafeEqual(sig, comp)) {
      throw new ApiErrorException(
        'Webhook signature verification failed.',
        401,
      );
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      throw new ApiErrorException(
        'Invalid webhook payload.',
        400,
      );
    }

    if (typeof payload !== 'object' || payload === null) {
      throw new ApiErrorException(
        'Invalid webhook payload.',
        400,
      );
    }

    return WebhookEvent.constructFrom(payload);
  }

  static computeSignature(rawBody, timestamp, secret) {
    return createHmac('sha256', secret)
      .update(`${timestamp}.${rawBody}`)
      .digest('hex');
  }
}
