# Moving the website off Lovable

This is the one-time checklist for moving kundalinidentalclinic.com.np off
Lovable onto infrastructure the clinic owns. The total running cost after the
move is zero on the free tiers. The domain and email stay where they are.

| Piece | Before | After |
|---|---|---|
| Public website | Lovable hosting | Cloudflare Pages (free), rebuilt by GitHub Actions |
| Database, admin login, image storage | Lovable Cloud | Your own Supabase project (free tier) |
| AI chat assistant | Lovable AI gateway (paid credits) | Google Gemini API key (free tier) |
| Lead email alerts | Resend | Resend (unchanged; re-add the key) |

Do the steps in order. Do not delete anything in Lovable until step 9 is done
and the new site has run for a week.

---

## 1. Create your Supabase project
1. Sign up at supabase.com with the clinic's Google account.
2. New project: name `kundalini-dental`, region **Mumbai (ap-south-1)**.
   Save the database password in a password manager.

## 2. Export your data from Lovable
1. In Lovable, open the project and go to **More → Database → Manage → Settings**.
2. Under **Export project data**, click **Export data**, then **Export** on the
   Database card, then **Start export**. Lovable emails you when it is ready.
3. Download the export from **More → Storage**.
4. While in **More → Storage**, download every file in the storage buckets
   (doctor photos, offer images, logos). Keep the folder structure.

The export includes admin user accounts and their passwords, so admins keep
their logins.

## 3. Load the data into your Supabase
This step needs a developer (or Claude, with the export file and your new
project's connection string). It runs `pg_restore` on the export into the new
project, then re-uploads the storage files into buckets with the same names.

Then run `supabase/cleanup-2026-11-sample-content.sql` in the Supabase SQL
Editor. It deletes the Lovable sample testimonials, invented case studies and
sample USD prices.

## 4. Deploy the edge functions and secrets
From a computer with the Supabase CLI:

```bash
supabase link --project-ref <new-project-ref>
supabase functions deploy dental-assistant-chat dental-assistant-webhook notify-lead admin-create-user
supabase secrets set AI_API_KEY=<gemini key> RESEND_API_KEY=<resend key> NOTIFY_EMAILS=<comma separated emails>
```

Get the Gemini key at aistudio.google.com → **Get API key**.

## 5. Create the Cloudflare Pages project
1. Sign up at dash.cloudflare.com (free).
2. **Workers & Pages → Create → Pages → Direct upload**, name it
   `kundalini-dental`. Upload any small file to create it; GitHub Actions does
   the real deploys.
3. Create an API token: **My Profile → API Tokens → Create Token → Edit
   Cloudflare Workers** template. Copy the token and your Account ID.

## 6. Add settings to GitHub
In the GitHub repo, open **Settings → Secrets and variables → Actions**.

Secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Variables (from Supabase → Project Settings → API):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (the anon / publishable key, never the service role key)
- `VITE_SUPABASE_PROJECT_ID`

Then go to **Actions → Build, prerender and deploy → Run workflow**. When it
finishes green, the site is live at `kundalini-dental.pages.dev`.

## 7. Test before switching the domain
On `kundalini-dental.pages.dev`, check:
- Every service page opens (the build fails on purpose if any linked page is missing).
- Contact form sends and the lead appears in `/admin` → Leads.
- `/admin` login works.
- The chat assistant answers.

## 8. Point the domain at Cloudflare
In Cloudflare Pages → `kundalini-dental` → **Custom domains**, add
`kundalinidentalclinic.com.np` and follow the DNS instructions. Keep your
existing email (MX) records unchanged.

## 9. Cancel Lovable
After a week of the new site running cleanly, downgrade or cancel the Lovable
plan.

---

## Day-to-day after the move
- **Editing content:** use `/admin` as before. Edits appear on the live site
  at the next automatic rebuild (every 6 hours), or straight away if you press
  **Run workflow** in GitHub Actions.
- **Changing prices:** edit `src/lib/pricing.ts` (and the price lines in
  `supabase/functions/dental-assistant-chat/index.ts`). Prices are no longer
  taken from the admin panel, so sample or mistyped prices cannot go live.
- **Exchange rate:** `NPR_PER_USD` in `src/lib/pricing.ts`; review quarterly.
