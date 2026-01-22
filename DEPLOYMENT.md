# GymMate - Complete Deployment Guide

## 📋 Pre-Deployment Checklist

### 1. Supabase Setup

#### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and set project name: `gymmate`
4. Set a strong database password
5. Choose region closest to your users

#### Run Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Copy the contents of `gym-mate-schema.sql`
3. Paste and run the SQL
4. Verify all tables are created

#### Configure Authentication
1. Go to Authentication → Providers
2. Enable Email provider
3. **Disable** email confirmation (for MVP testing)
4. Enable Google OAuth:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com)
   - Add authorized redirect: `https://[your-project].supabase.co/auth/v1/callback`
5. Enable Apple OAuth (optional):
   - Get credentials from Apple Developer
   - Add redirect URI

#### Get API Keys
1. Go to Settings → API
2. Copy `Project URL` → This is `VITE_SUPABASE_URL`
3. Copy `anon public` key → This is `VITE_SUPABASE_ANON_KEY`

---

### 2. Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Get API Key"
3. Create new API key
4. Copy the key → This is `VITE_GEMINI_API_KEY`

---

### 3. Stripe Setup

#### Create Account
1. Go to [stripe.com](https://stripe.com)
2. Create account or sign in
3. Switch to **Test Mode** (toggle in top right)

#### Create Products
1. Go to Products → Add Product
2. Create "GymMate Pro":
   - Name: GymMate Pro
   - Price: £6.99/month
   - Recurring billing
   - Copy the Price ID → `VITE_STRIPE_PRO_PRICE_ID`
3. Create "GymMate Elite":
   - Name: GymMate Elite
   - Price: £9.99/month
   - Recurring billing
   - Copy the Price ID → `VITE_STRIPE_ELITE_PRICE_ID`

#### Get API Keys
1. Go to Developers → API Keys
2. Copy "Publishable key" → `VITE_STRIPE_PUBLISHABLE_KEY`
3. Copy "Secret key" (save for Supabase Edge Function)

#### Set Up Webhooks (Later)
1. Go to Developers → Webhooks
2. Add endpoint: `https://[your-project].supabase.co/functions/v1/stripe-webhook`
3. Select events: `customer.subscription.*`

---

## 🚀 Deployment Steps

### Step 1: Update Environment Variables

Create `.env` file in `gym-mate-react/`:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Google Gemini
VITE_GEMINI_API_KEY=your-gemini-api-key-here

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-key-here
VITE_STRIPE_PRO_PRICE_ID=price_your-pro-id
VITE_STRIPE_ELITE_PRICE_ID=price_your-elite-id
```

### Step 2: Test Locally

```bash
cd gym-mate-react
npm install
npm run dev
```

Visit `http://localhost:5173` and test:
- ✅ Sign up with email
- ✅ Complete onboarding
- ✅ Swipe on profiles
- ✅ OAuth buttons appear (won't work until configured)

### Step 3: Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized files.

### Step 4: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd gym-mate-react
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: gymmate
# - Directory: ./
# - Override settings? No
```

#### Option B: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import from Git or upload `gym-mate-react` folder
4. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables (same as `.env`)
6. Click "Deploy"

### Step 5: Configure Custom Domain (Optional)

1. In Vercel dashboard → Settings → Domains
2. Add your domain (e.g., `gymmate.app`)
3. Update DNS records as instructed
4. Update Supabase OAuth redirects to use new domain

---

## 🔧 Post-Deployment Configuration

### Update Supabase Redirects

1. Go to Supabase → Authentication → URL Configuration
2. Add Site URL: `https://your-app.vercel.app`
3. Add Redirect URLs:
   - `https://your-app.vercel.app/auth/callback`
   - `http://localhost:5173/auth/callback` (for local dev)

### Update OAuth Providers

**Google:**
1. Google Cloud Console → Credentials
2. Add authorized redirect: `https://[your-project].supabase.co/auth/v1/callback`

**Apple:**
1. Apple Developer → Certificates, IDs & Profiles
2. Update Return URLs

---

## 🧪 Testing Checklist

After deployment, test:

- [ ] Email signup/login works
- [ ] Google OAuth works
- [ ] Profile creation saves to database
- [ ] Swipe creates matches
- [ ] Real-time chat updates
- [ ] Pulse AI responds (if Gemini key added)
- [ ] Stripe checkout redirects (test mode)

---

## 🐛 Troubleshooting

### "Invalid API Key" Error
- Check environment variables in Vercel dashboard
- Ensure no extra spaces in keys
- Redeploy after adding variables

### OAuth Not Working
- Verify redirect URLs in Supabase
- Check OAuth provider configuration
- Ensure Site URL is set correctly

### Database Errors
- Check RLS policies are enabled
- Verify schema was run completely
- Check Supabase logs

### Stripe Not Loading
- Verify publishable key is correct
- Check browser console for errors
- Ensure Stripe.js is loaded

---

## 📊 Monitoring

### Supabase
- Database → Monitor queries
- Auth → View user signups
- Logs → Check errors

### Vercel
- Analytics → View traffic
- Logs → Runtime errors
- Deployments → Build status

---

## 🔐 Security Checklist

- [ ] Environment variables set in Vercel (not in code)
- [ ] RLS policies enabled on all tables
- [ ] HTTPS enforced
- [ ] OAuth redirect URLs whitelisted
- [ ] Stripe webhook signature verification (when implemented)

---

## 🎯 Next Steps

1. **Test thoroughly** in production
2. **Add Supabase Edge Functions** for Stripe webhooks
3. **Implement email verification** for production
4. **Add error tracking** (Sentry)
5. **Set up analytics** (PostHog/Mixpanel)
6. **Create admin panel** for user management
7. **Add trainer marketplace** features
8. **Switch Stripe to live mode** when ready

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Gemini API**: https://ai.google.dev/docs

---

## 🚨 Important Notes

1. **Keep test mode** until fully tested
2. **Backup database** before schema changes
3. **Monitor costs** (Supabase/Vercel/Stripe)
4. **Rate limit** API calls in production
5. **Add proper error boundaries** before launch

---

**Deployment Time**: ~30 minutes
**Total Setup Time**: ~2 hours (including API configurations)

Good luck with your launch! 🚀
