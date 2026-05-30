# 🥐 Dahilia Oven - Premium Loyalty Platform

## Overview
**Dahilia Oven** is a complete, production-ready loyalty platform for artisan bakeries and cafés. Built with the best modern technologies, featuring email-based authentication, QR code loyalty system, and email campaign management.

## ✨ What Makes This The Best

### 1. Email Authentication System
- **Secure Email/Password Login** - Supabase Auth
- **Email Confirmation** - Users verify email before access
- **Protected Routes** - Middleware ensures security
- **Auto-redirect** - Smart routing based on auth state

### 2. Universal QR Code System
- **Unique QR per Customer** - Generated on signup
- **Email Delivery** - QR code sent to customer's email
- **Beautiful Email Templates** - Premium bakery branding
- **Staff Scanner** - Quick scan to add points
- **Real-time Updates** - Points update instantly

### 3. Email Campaign Management
- **Campaign Creator** - Write and send to all members
- **Rich HTML Emails** - Beautiful bakery-themed templates
- **Member Analytics** - See total reach and engagement
- **Campaign History** - Track all past campaigns

### 4. Premium UI/UX Design
- **Framer Motion Animations** - Smooth transitions throughout
- **Warm Bakery Colors** - Caramel, cream, copper palette
- **Glass Morphism** - Modern frosted glass effects
- **Responsive Design** - Works on all devices
- **Micro-interactions** - Hover effects, loading states

### 5. Real-Time Data
- **Supabase Subscriptions** - Live updates
- **Instant Point Updates** - No refresh needed
- **Transaction History** - Shows immediately

## 🎨 Branding - Dahilia Oven

### Colors
```
--dahilia-primary: #D4A574      /* Warm Caramel */
--dahilia-secondary: #8B6914    /* Golden Brown */
--dahilia-accent: #E07B39       /* Burnt Orange */
--dahilia-cream: #FFF8F0        /* Warm Cream */
--dahilia-chocolate: #4A3728    /* Dark Chocolate */
--dahilia-copper: #B87333       /* Copper */
```

### Typography
- **Font**: Inter (clean, modern)
- **Icons**: Lucide React
- **Logo**: Croissant icon 🥐

## 📁 Project Structure

```
my-app/
├── app/
│   ├── api/
│   │   └── send-email/route.ts      # Email sending API
│   ├── auth/
│   │   ├── page.tsx                 # Email login/signup (Dahilia branded)
│   │   └── callback/route.ts        # Auth callback handler
│   ├── dashboard/
│   │   ├── campaigns/page.tsx       # Email campaign manager
│   │   ├── customer/page.tsx        # Customer dashboard
│   │   └── page.tsx                 # Owner dashboard
│   ├── scanner/page.tsx             # Employee QR scanner
│   ├── employee-login/page.tsx      # Staff login
│   ├── page.tsx                     # Redirects to /auth
│   ├── layout.tsx                   # Root layout with metadata
│   └── globals.css                  # Premium styles & animations
├── components/
│   └── providers/
│       └── SupabaseProvider.tsx     # Supabase context
├── lib/
│   ├── email.ts                     # Email service with QR templates
│   ├── utils.ts                     # Utilities
│   └── supabase.ts                  # Supabase client
├── types/
│   ├── index.ts                     # TypeScript interfaces
│   └── database.ts                  # Database types
├── middleware.ts                    # Route protection
├── tailwind.config.ts               # Dahilia color theme
└── .env.local.example               # Environment variables
```

## 🔧 Environment Setup

Create `.env.local`:
```env
# Dahilia Oven Configuration
NEXT_PUBLIC_RESTAURANT_NAME=Dahilia Oven
NEXT_PUBLIC_RESTAURANT_EMAIL=loyalty@dahiliaoven.com

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend Email API
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=loyalty@dahiliaoven.com
RESEND_FROM_NAME=Dahilia Oven
```

## 🚀 Pages & Features

### 1. Authentication Page (`/auth`)
- Email login and signup
- Password validation
- Email confirmation flow
- Animated transitions
- Error handling
- **Demo**: Sign up with any email

### 2. Customer Dashboard (`/dashboard/customer`)
- Personal QR code display
- Points tracking
- Progress to next reward
- Transaction history
- Real-time updates
- Sign out

### 3. Campaign Manager (`/dashboard/campaigns`)
- Create email campaigns
- Send to all loyalty members
- Beautiful email templates
- Campaign history
- Analytics (members, reach)

### 4. Employee Scanner (`/scanner`)
- QR code scanning
- Amount entry with numpad
- Points calculation
- Success confirmation
- Audio feedback

### 5. Owner Dashboard (`/dashboard`)
- Business analytics
- Customer list
- Reward management

## 📧 Email Templates

### Welcome Email with QR Code
```
Subject: 🥐 Welcome to Dahilia Oven Loyalty!

- Beautiful bakery-themed design
- QR code for loyalty scanning
- Benefits explanation
- Dashboard link
- Social media CTA
```

### Campaign Email
```
Subject: 🥐 [Campaign Title]

- Rich HTML formatting
- Warm color palette
- Call-to-action buttons
- Bakery branding
```

## 🎯 Key Features

### For Customers:
1. **Sign up** with email
2. **Receive QR code** via email
3. **Show QR** at checkout
4. **Earn points** automatically
5. **Track rewards** in dashboard
6. **Receive offers** via email

### For Staff:
1. **Login** with PIN (1234)
2. **Scan customer QR**
3. **Enter amount**
4. **Points added** instantly

### For Owners:
1. **View analytics**
2. **Manage customers**
3. **Create campaigns**
4. **Send email offers**
5. **Track engagement**

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Supabase Auth (@supabase/ssr)
- **Database**: Supabase PostgreSQL
- **Real-time**: Supabase Subscriptions
- **Email**: Resend API
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **QR Codes**: qrcode.react

## 📝 Database Schema

### Tables Required:
1. **customers** - Loyalty members
2. **transactions** - Point transactions
3. **rewards** - Available rewards
4. **campaigns** - Email campaigns
5. **employees** - Staff accounts

See `database/schema.sql` for full schema.

## 🚀 Setup Instructions

### 1. Create Supabase Project
```
1. Go to supabase.com
2. Create new project
3. Copy URL and keys to .env.local
4. Run database/schema.sql
5. Enable Email provider in Auth settings
```

### 2. Set Up Resend
```
1. Create account at resend.com
2. Verify domain (dahiliaoven.com)
3. Get API key
4. Add to .env.local
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open in Browser
```
http://localhost:3000
```

## 🎨 Design Highlights

### Animations:
- Floating logo
- Page transitions
- Card hover effects
- Progress bars
- Loading spinners
- Success checkmarks

### Visual Elements:
- Gradient backgrounds
- Glass morphism cards
- Warm color palette
- Rounded corners
- Soft shadows
- Custom scrollbar

## 📱 Responsive Design

Works perfectly on:
- Desktop computers
- Tablets
- Mobile phones
- Staff iPads (scanner)

## 🔒 Security Features

- Row Level Security (RLS) policies
- Protected API routes
- Middleware authentication
- Email verification
- Secure password handling

## 🎁 Demo Credentials

- **Employee PIN**: 1234
- **Email Login**: Any valid email
- **QR Scanner**: Works with any generated QR

## 🌟 Next Steps

1. **Deploy to Vercel** - One-click deployment
2. **Configure domain** - dahiliaoven.com
3. **Set up Resend domain** - For email delivery
4. **Add more rewards** - Expand loyalty tiers
5. **Configure SMS** - Twilio integration
6. **Add analytics** - Detailed insights

## 💖 What Makes This Special

1. **Complete Solution** - Everything works together
2. **Production Ready** - Built for real business
3. **Beautiful Design** - Premium bakery feel
4. **Email First** - No app download needed
5. **Real-time Data** - Instant updates
6. **Campaign System** - Marketing built-in
7. **Easy Setup** - Simple configuration

---

**Built with love for Dahilia Oven** 🥐✨

*Made by a product developer who understands bakeries need warm, inviting technology.*
