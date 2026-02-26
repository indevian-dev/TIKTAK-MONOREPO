# Next.js Notification Channels

## 1. Overview
The platform supports multi-channel notification dispatching, completely decoupling the business logic (which triggers an event) from the infrastructure logic (how the user actually receives that event: In-App, Email, Push).

## 2. Directory Structure
- **Templates:** `next/lib/notifications/Mail.templates.ts` (HTML string generation for emails).
- **Dispatchers:** Adapters exist for resolving Notification preferences and dispatching them to external providers (e.g., SendGrid, Postmark) or logging them to the database for In-App viewing.

## 3. Implementation Patterns

### The Dispatcher Flow
1. **Trigger:** A core domain service (e.g., `ClassService`) successfully commits an action (like publishing a new resource).
2. **Preference Evaluation:** The notification service evaluates the target user's configured preferences.
3. **Dispatch Execution:**
   - **Database Insertion:** It writes a persistent `NotificationLog` record tied to the `userId` for the In-App "bell" icon to consume.
   - **Email:** If `EMAIL_ENABLED`, it fetches the localized string template from `Mail.templates.ts` and passes it to the mail provider client.

## 4. Agent Rules (Do's and Don'ts)
- **ALWAYS** route external communication triggers through dedicated notification services or clients instead of raw-calling third-party APIs directly from a core domain service.
- **ALWAYS** include an asynchronous fallback. If an external Push provider fails or times out, it should be natively caught and logged via `ctx.log.warn`, and the main user request should still succeed.
- **DO NOT** use inline HTML strings inside business logic to send emails. Maintain HTML structures exclusively inside `Mail.templates.ts` utilizing localized variable injections.
- **DO** categorize notifications strictly by Type/Severity (e.g., `INFO`, `ALERT`, `SUCCESS`) to allow proper frontend visual rendering (Icon colors, Toast types).
