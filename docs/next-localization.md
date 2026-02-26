# Next.js Localization & I18n

## 1. Overview
The Web application is fully localized using `next-intl`, supporting dynamic runtime locale switching.
- **Route Level Localization:** URLs always contain the locale (e.g., `/en/dashboard`, `/az/auth/login`).
- **Translation Scope:** Extends to UI Strings, Dates, Numbers, and AI Agent Output.

## 2. Directories and Configurations
- **Dictionaries:** Located in `next/i18n/messages/[locale]/...`.
- **Config:** `next/i18n/request.ts` and `next/i18n/routing.ts` control valid locales and request configurations.
- **Middleware:** `middleware.ts` forces localization redirects for incoming un-prefixed traffic to default locales.

## 3. Architecture & Guidelines
### UI Translations
Components should consume translations using the hooks provided by `next-intl`.
```tsx
import { useTranslations } from 'next-intl';

export default function WelcomeHero() {
  // 'Auth.Login' scopes the translations to that JSON block
  const t = useTranslations('Auth.Login');
  return <h1>{t('title')}</h1>;
}
```

### AI Context Localization
Since AI requests evaluate dynamically in the backend based on `unifiedApiHandler` controllers, we must enforce the active locale on generated outputs:
1. The frontend should organically pass `locale` to backend API routes.
2. The Core Service layer injects the `locale` strictly inside the System Instructions to the AI Model: "Output your answers exclusively in {locale}".
3. Generated content persisted to the database (Summary Digests, AI lessons) retains the language of the prompt.

## 4. Agent Rules (Do's and Don'ts)
- **ALWAYS** extract hardcoded english strings into `messages/en.json` (and matching structural files for other locales) immediately.
- **ALWAYS** pass `locale` context down to business-layer functions heavily relying on text parsing or generation.
- **DO NOT** use native `Date.toLocaleDateString()` without explicitly defining the user's active locale; prefer `next-intl`'s `format.dateTime()`.
- **DO NOT** override URL locale paradigms. Let `next/navigation` wrapper hooks (`useRouter`, `Link` from `next-intl/navigation`) handle path routing to avoid dropping the `/[locale]/` prefix.
