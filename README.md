# Maqo landing page

Marketing site for Maqo solar (https://get.maqo.asia) plus a staff CMS at
`/admin`. Built with Next.js 16, Supabase and Tailwind, hosted on Vercel.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
```

Run `npm run build` before pushing. Pushing to `main` goes live.

## Secrets

Create `.env.local` and get the values from a maintainer. **Never commit
it.** This repo is public.

```
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
LEAD_TOKEN_SECRET=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
LEAD_WEBHOOK_URL=
CI_LEAD_WEBHOOK_URL=
TESTING_WEBHOOK_URL=      # optional, see "Lead webhook"
TEST_WEBHOOK_TOKEN=       # optional, see "Lead webhook"
```

## Where things are

| Folder | What's in it |
| --- | --- |
| `app/[lang]/(main)/` | Public pages, in English (`/en`), Chinese (`/cn`) and Malay (`/ms`) |
| `app/[lang]/(ev)/ev/` | EV charging landing page |
| `app/(admin)/admin/` | Staff CMS: edit content, view enquiries, analytics |
| `lib/` | Shared helpers, translations (`lib/i18n/`), Supabase client |
| `public/` | Images and logos |
| `proxy.ts` | Runs on every request: language redirect, security headers, admin login |

## Common edits

| To change... | Go to |
| --- | --- |
| FAQs, blog posts, products, C&I projects, client logos, contact details | CMS at `/admin` (no code needed) |
| Lead form fields and dropdown options | CMS at `/admin/leads-form` |
| Other page text (headings, sections, buttons, menu) | `lib/i18n/dictionaries/` (`en.ts`, `cn.ts`, `ms.ts`). Change all three languages. |
| A page's layout or sections | That page's folder under `app/[lang]/(main)/` |
| Staff accounts and roles | CMS at `/admin/users` (admins only) |

CMS edits are saved as a draft and go live when you press Publish.

## Lead webhook

Every form submission is saved to Supabase (see it in `/admin/enquiries`)
and also POSTed as JSON to the CRM:

- Residential and EV leads go to `LEAD_WEBHOOK_URL`
- C&I leads go to `CI_LEAD_WEBHOOK_URL`

The JSON shape is built in `lib/leadWebhookTemplate.ts` and must match what
the CRM workflow expects. Most keys are left blank on purpose. If you rename
a field there, update the CRM workflow too, or leads arrive with empty
fields. If a URL is missing, the webhook is skipped. If the CRM is down, the
lead is still saved in Supabase.

To test C&I without polluting the CRM, set `TESTING_WEBHOOK_URL` and a
`test_webhook` cookie in the browser (`1` locally, `TEST_WEBHOOK_TOKEN` on
production). Submissions then go to the test URL instead. The code is in
`app/[lang]/(main)/actions/submitLead.ts`.

> This Next.js version is newer than most tutorials. If something looks
> unfamiliar, check `node_modules/next/dist/docs/`.
