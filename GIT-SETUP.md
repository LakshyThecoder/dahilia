# Git Setup for Dahilia Oven

## GitHub Repository Setup

Run these commands in your terminal to push to GitHub:

```bash
# Navigate to your project directory
cd f:\Project-Loop\my-app

# Initialize Git repository
git init

# Add the README with Dahilia branding
echo "# dahilia" >> README.md

# Stage all files
git add README.md
git add .

# Create initial commit
git commit -m "first commit"

# Rename branch to main
git branch -M main

# Add remote origin
git remote add origin https://github.com/LakshyThecoder/dahilia.git

# Push to GitHub
git push -u origin main
```

## Vercel Deployment

### Domain: `dahiliavaltoris.vercel.app`

After pushing to GitHub, deploy to Vercel:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

Or connect GitHub repo to Vercel:
1. Go to https://vercel.com/new
2. Import `LakshyThecoder/dahilia`
3. Set environment variables (copy from .env.local)
4. Deploy!

## Environment Variables for Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_RESTAURANT_NAME=Dahilia Oven
NEXT_PUBLIC_RESTAURANT_EMAIL=loyalty@dahiliaoven.com
NEXT_PUBLIC_APP_URL=https://dahiliavaltoris.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://piwhdqbyqvrwtqvqfxlq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-key]
SUPABASE_SERVICE_ROLE_KEY=[your-key]
SMTP_HOST=mail.privateemail.com
SMTP_PORT=587
SMTP_USER=hello@enday.app
SMTP_PASS=Otacremrepus140%
EMAIL_TRANSPORT=smtp
```

## Project Structure

```
dahilia/
├── app/
│   ├── auth/page.tsx           # Login/Signup
│   ├── profile-setup/page.tsx  # After login profile setup
│   ├── dashboard/
│   │   ├── admin/page.tsx      # Admin dashboard
│   │   ├── customer/page.tsx   # Customer dashboard
│   │   └── campaigns/page.tsx  # Email campaigns
│   ├── scanner/page.tsx        # QR Scanner
│   └── api/send-email/route.ts # Email API
├── components/
│   ├── providers/
│   │   └── SupabaseProvider.tsx
│   └── ui/
│       └── Toast.tsx
├── lib/
│   ├── hooks/useRealtime.ts
│   ├── email-service.ts
│   └── supabase.ts
├── types/
│   └── database.ts
└── .env.local
```

## Features

✅ **Real-time** loyalty points updates
✅ **Instant email** delivery (< 10 seconds)
✅ **Admin dashboard** with customer management
✅ **Profile setup** after login
✅ **QR code** scanning for staff
✅ **Campaign management** with progress tracking
✅ **Toast notifications** for all actions
✅ **Warm bakery** themed UI (Dahilia branding)

## Branding

- **Name:** Dahilia Oven
- **Colors:** Warm Caramel (#D4A574), Golden Brown (#8B6914)
- **Domain:** dahiliavaltoris.vercel.app
- **Email:** loyalty@dahiliaoven.com
