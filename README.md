# Emailit Node.js

[![Tests](https://img.shields.io/github/actions/workflow/status/emailit/emailit-node/tests.yml?label=tests&style=for-the-badge&labelColor=111827)](https://github.com/emailit/emailit-node/actions)
[![npm Version](https://img.shields.io/npm/v/@emailit/node?style=for-the-badge&labelColor=111827)](https://www.npmjs.com/package/@emailit/node)
[![License](https://img.shields.io/github/license/emailit/emailit-node?style=for-the-badge&labelColor=111827)](https://github.com/emailit/emailit-node/blob/main/LICENSE)

The official Node.js SDK for the [Emailit](https://emailit.com) Email API.

## Requirements

- Node.js 18+

## Installation

```bash
npm install @emailit/node
```

## Getting Started

```js
import { Emailit } from '@emailit/node';

const emailit = new Emailit('your_api_key');

const email = await emailit.emails.send({
  from: 'hello@yourdomain.com',
  to: ['user@example.com'],
  subject: 'Hello from Emailit',
  html: '<h1>Welcome!</h1><p>Thanks for signing up.</p>',
});

console.log(email.id);     // em_abc123...
console.log(email.status); // pending
```

All service methods return resource objects with direct property access -- just like the Stripe SDK.

## Available Services

| Service | Property | Description |
|---------|----------|-------------|
| Emails | `emailit.emails` | Send, list, get, cancel, retry emails |
| Domains | `emailit.domains` | Create, verify, list, manage sending domains |
| API Keys | `emailit.apiKeys` | Create, list, manage API keys |
| Audiences | `emailit.audiences` | Create, list, manage audiences |
| Subscribers | `emailit.subscribers` | Add, list, manage subscribers in audiences |
| Templates | `emailit.templates` | Create, list, publish email templates |
| Suppressions | `emailit.suppressions` | Create, list, manage suppressed addresses |
| Email Verifications | `emailit.emailVerifications` | Verify email addresses |
| Email Verification Lists | `emailit.emailVerificationLists` | Create, list, get results, export |
| Webhooks | `emailit.webhooks` | Create, list, manage webhooks |
| Contacts | `emailit.contacts` | Create, list, manage contacts |
| Events | `emailit.events` | List and retrieve events |

## Usage

### Emails

#### Send an email

```js
const email = await emailit.emails.send({
  from: 'hello@yourdomain.com',
  to: ['user@example.com'],
  subject: 'Hello from Emailit',
  html: '<h1>Welcome!</h1>',
});

console.log(email.id);
console.log(email.status);
```

#### Send with a template

```js
const email = await emailit.emails.send({
  from: 'hello@yourdomain.com',
  to: 'user@example.com',
  template: 'welcome_email',
  variables: {
    name: 'John Doe',
    company: 'Acme Inc',
  },
});
```

#### Send with attachments

```js
import { readFileSync } from 'node:fs';

const email = await emailit.emails.send({
  from: 'invoices@yourdomain.com',
  to: 'customer@example.com',
  subject: 'Your Invoice #12345',
  html: '<p>Please find your invoice attached.</p>',
  attachments: [
    {
      filename: 'invoice.pdf',
      content: readFileSync('invoice.pdf').toString('base64'),
      content_type: 'application/pdf',
    },
  ],
});
```

#### Schedule an email

```js
const email = await emailit.emails.send({
  from: 'reminders@yourdomain.com',
  to: 'user@example.com',
  subject: 'Appointment Reminder',
  html: '<p>Your appointment is tomorrow at 2 PM.</p>',
  scheduled_at: '2026-01-10T09:00:00Z',
});

console.log(email.status);       // scheduled
console.log(email.scheduled_at); // 2026-01-10T09:00:00Z
```

#### List emails

```js
const emails = await emailit.emails.list({ page: 1, limit: 10 });

for (const email of emails) {
  console.log(`${email.id} — ${email.status}`);
}

if (emails.hasMore()) {
  // fetch next page
}
```

#### Cancel / Retry

```js
await emailit.emails.cancel('em_abc123');
await emailit.emails.retry('em_abc123');
```

---

### Domains

```js
// Create a domain
const domain = await emailit.domains.create({
  name: 'example.com',
  track_loads: true,
  track_clicks: true,
});
console.log(domain.id);

// Verify DNS
const verified = await emailit.domains.verify('sd_123');

// List all domains
const domains = await emailit.domains.list();

// Get a domain
const d = await emailit.domains.get('sd_123');

// Update a domain
await emailit.domains.update('sd_123', { track_clicks: false });

// Delete a domain
await emailit.domains.delete('sd_123');
```

---

### API Keys

```js
// Create an API key
const key = await emailit.apiKeys.create({
  name: 'Production Key',
  scope: 'full',
});
console.log(key.key); // only available on create

// List all API keys
const keys = await emailit.apiKeys.list();

// Get an API key
const k = await emailit.apiKeys.get('ak_123');

// Update an API key
await emailit.apiKeys.update('ak_123', { name: 'Renamed Key' });

// Delete an API key
await emailit.apiKeys.delete('ak_123');
```

---

### Audiences

```js
// Create an audience
const audience = await emailit.audiences.create({ name: 'Newsletter' });
console.log(audience.id);
console.log(audience.token);

// List audiences
const audiences = await emailit.audiences.list();

// Get an audience
const a = await emailit.audiences.get('aud_123');

// Update an audience
await emailit.audiences.update('aud_123', { name: 'Updated Newsletter' });

// Delete an audience
await emailit.audiences.delete('aud_123');
```

---

### Subscribers

Subscribers belong to an audience, so the audience ID is always the first argument.

```js
// Add a subscriber
const subscriber = await emailit.subscribers.create('aud_123', {
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe',
});

// List subscribers in an audience
const subscribers = await emailit.subscribers.list('aud_123');

// Get a subscriber
const s = await emailit.subscribers.get('aud_123', 'sub_456');

// Update a subscriber
await emailit.subscribers.update('aud_123', 'sub_456', {
  first_name: 'Jane',
});

// Delete a subscriber
await emailit.subscribers.delete('aud_123', 'sub_456');
```

---

### Templates

```js
// Create a template
const template = await emailit.templates.create({
  name: 'Welcome',
  subject: 'Welcome!',
  html: '<h1>Hi {{name}}</h1>',
});

// List templates
const templates = await emailit.templates.list();

// Get a template
const t = await emailit.templates.get('tem_123');

// Update a template
await emailit.templates.update('tem_123', { subject: 'New Subject' });

// Publish a template
await emailit.templates.publish('tem_123');

// Delete a template
await emailit.templates.delete('tem_123');
```

---

### Suppressions

```js
// Create a suppression
const suppression = await emailit.suppressions.create({
  email: 'spam@example.com',
  type: 'hard_bounce',
  reason: 'Manual suppression',
});

// List suppressions
const suppressions = await emailit.suppressions.list();

// Get a suppression
const sup = await emailit.suppressions.get('sup_123');

// Update a suppression
await emailit.suppressions.update('sup_123', { reason: 'Updated' });

// Delete a suppression
await emailit.suppressions.delete('sup_123');
```

---

### Email Verifications

```js
const result = await emailit.emailVerifications.verify({
  email: 'test@example.com',
});

console.log(result.status); // valid
console.log(result.score);  // 0.95
console.log(result.risk);   // low
```

---

### Email Verification Lists

```js
// Create a verification list
const list = await emailit.emailVerificationLists.create({
  name: 'Marketing List Q1',
  emails: [
    'user1@example.com',
    'user2@example.com',
    'user3@example.com',
  ],
});
console.log(list.id);     // evl_abc123...
console.log(list.status); // pending

// List all verification lists
const lists = await emailit.emailVerificationLists.list();

// Get a verification list
const vl = await emailit.emailVerificationLists.get('evl_abc123');
console.log(vl.stats.successful_verifications);

// Get verification results
const results = await emailit.emailVerificationLists.results('evl_abc123', { page: 1, limit: 50 });

for (const r of results) {
  console.log(`${r.email} — ${r.result}`);
}

// Export results as XLSX
import { writeFileSync } from 'node:fs';
const response = await emailit.emailVerificationLists.export('evl_abc123');
writeFileSync('results.xlsx', response.body);
```

---

### Webhooks

```js
// Create a webhook
const webhook = await emailit.webhooks.create({
  name: 'My Webhook',
  url: 'https://example.com/hook',
  all_events: true,
  enabled: true,
});
console.log(webhook.id);

// List webhooks
const webhooks = await emailit.webhooks.list();

// Get a webhook
const wh = await emailit.webhooks.get('wh_123');

// Update a webhook
await emailit.webhooks.update('wh_123', { enabled: false });

// Delete a webhook
await emailit.webhooks.delete('wh_123');
```

---

### Contacts

```js
// Create a contact
const contact = await emailit.contacts.create({
  email: 'user@example.com',
  first_name: 'John',
  last_name: 'Doe',
});
console.log(contact.id);

// List contacts
const contacts = await emailit.contacts.list();

// Get a contact
const c = await emailit.contacts.get('con_123');

// Update a contact
await emailit.contacts.update('con_123', { first_name: 'Jane' });

// Delete a contact
await emailit.contacts.delete('con_123');
```

---

### Events

```js
// List events
const events = await emailit.events.list({ type: 'email.delivered' });

for (const event of events) {
  console.log(event.type);
}

// Get an event
const event = await emailit.events.get('evt_123');
console.log(event.type);
console.log(event.data.email_id);
```

## Webhook Events

The SDK provides typed event classes for all Emailit webhook event types under the events module, plus a `WebhookSignature` class for verifying webhook request signatures.

### Verifying Webhook Signatures

```js
import { WebhookSignature, EmailDelivered } from '@emailit/node';

const rawBody = await request.text();
const signature = request.headers.get('x-emailit-signature');
const timestamp = request.headers.get('x-emailit-timestamp');
const secret = 'your_webhook_signing_secret';

try {
  const event = WebhookSignature.verify(rawBody, signature, timestamp, secret);

  // event is automatically typed based on the event type
  console.log(event.type);     // e.g. "email.delivered"
  console.log(event.event_id); // e.g. "evt_abc123"

  // Access the event data
  const data = event.getEventData();

  if (event instanceof EmailDelivered) {
    // Handle delivered email
  }
} catch (e) {
  // Invalid signature or timestamp
  return new Response(e.message, { status: 401 });
}
```

You can disable replay protection by passing `null` for tolerance, or set a custom tolerance in seconds:

```js
// Skip replay check
const event = WebhookSignature.verify(rawBody, signature, timestamp, secret, null);

// Custom 10-minute tolerance
const event = WebhookSignature.verify(rawBody, signature, timestamp, secret, 600);
```

### Available Event Types

**Emails:** `email.accepted`, `email.scheduled`, `email.delivered`, `email.bounced`, `email.attempted`, `email.failed`, `email.rejected`, `email.suppressed`, `email.received`, `email.complained`, `email.clicked`, `email.loaded`

**Domains:** `domain.created`, `domain.updated`, `domain.deleted`

**Audiences:** `audience.created`, `audience.updated`, `audience.deleted`

**Subscribers:** `subscriber.created`, `subscriber.updated`, `subscriber.deleted`

**Contacts:** `contact.created`, `contact.updated`, `contact.deleted`

**Templates:** `template.created`, `template.updated`, `template.deleted`

**Suppressions:** `suppression.created`, `suppression.updated`, `suppression.deleted`

**Email Verifications:** `email_verification.created`, `email_verification.updated`, `email_verification.deleted`

**Email Verification Lists:** `email_verification_list.created`, `email_verification_list.updated`, `email_verification_list.deleted`

Each event type has a corresponding class (e.g. `EmailDelivered`, `DomainCreated`). You can use `instanceof` checks or the `EVENT_TYPE` static property for routing:

```js
import { EmailDelivered, EmailBounced, ContactCreated } from '@emailit/node';

if (event instanceof EmailDelivered) {
  handleDelivered(event);
} else if (event instanceof EmailBounced) {
  handleBounce(event);
} else if (event instanceof ContactCreated) {
  handleNewContact(event);
}
```

## Error Handling

The SDK throws typed exceptions for API errors:

```js
import {
  AuthenticationException,
  InvalidRequestException,
  RateLimitException,
  UnprocessableEntityException,
  ApiConnectionException,
  ApiErrorException,
} from '@emailit/node';

try {
  await emailit.emails.send({ /* ... */ });
} catch (e) {
  if (e instanceof AuthenticationException) {
    // Invalid API key (401)
  } else if (e instanceof InvalidRequestException) {
    // Bad request or not found (400, 404)
  } else if (e instanceof RateLimitException) {
    // Too many requests (429)
  } else if (e instanceof UnprocessableEntityException) {
    // Validation failed (422)
  } else if (e instanceof ApiConnectionException) {
    // Network error
  } else if (e instanceof ApiErrorException) {
    // Any other API error
    console.log(e.httpStatus);
    console.log(e.httpBody);
    console.log(e.jsonBody);
  }
}
```

## License

MIT -- see [LICENSE](LICENSE) for details.
