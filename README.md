# 🎲 Giveaway Site

Instagram giveaway site — users enter their username and instantly get a unique lucky number (1–1000). Built with **Next.js 14 + Supabase**, deployed on **Vercel**.

---

## Setup in 3 Steps

### Step 1 — Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Open **SQL Editor** and paste the contents of `supabase-setup.sql` → Run it
3. Go to **Project Settings → API** and copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep this secret!)

### Step 2 — Local Development

```bash
# Install dependencies
npm install

# Create your env file
cp .env.example .env.local
# Fill in your 3 Supabase values in .env.local

# Run locally
npm run dev
# Open http://localhost:3000
```

### Step 3 — Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. In Vercel project settings → **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Click **Deploy** ✅

---

## How to See All Entries (Your Admin View)

Go to your **Supabase Dashboard → Table Editor → entries**. You'll see:
- Every Instagram username
- Their lucky number
- The timestamp they entered

You can also export to CSV from there.

---

## Features

- ✅ One-tap lucky number — instant assignment
- ✅ Duplicate prevention — same username can't enter twice
- ✅ Number uniqueness — guaranteed at database level (`UNIQUE` constraint)
- ✅ Number rolls with animation on result screen
- ✅ Live entries list visible to all visitors
- ✅ Fully in English
- ✅ Mobile-friendly dark UI
