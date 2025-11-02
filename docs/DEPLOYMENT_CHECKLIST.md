# 🚀 Tripper Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

## Pre-Deployment Setup

### ✅ Supabase Configuration

- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Run database migration SQL (`lib/supabase/database.sql`)
- [ ] Verify all tables created: `user_profiles`, `trips`, `days`, `cards`, `user_preferences`
- [ ] Test RLS policies (try accessing data as different users)
- [ ] Set up authentication providers (Email + optional OAuth)
- [ ] Configure email templates (Welcome, Password Reset, Verification)
- [ ] Add production URL to "Site URL" in Auth settings
- [ ] Add `/auth/callback` to "Redirect URLs"

### ✅ Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
```

- [ ] All variables set in `.env.local`
- [ ] OpenAI API key has credit ($5 minimum recommended)
- [ ] Test auth locally (signup, login, logout)
- [ ] Test AI features locally (discover page)

### ✅ Code Quality

- [ ] Run `npm run lint` - Fix any errors
- [ ] Test all authentication flows
- [ ] Test trip creation and editing
- [ ] Test AI suggestions
- [ ] Test data migration from localStorage
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Verify all images optimize properly
- [ ] Check for console errors

## Deployment to Vercel

### ✅ Initial Setup

- [ ] Push code to GitHub/GitLab
- [ ] Create Vercel account at [vercel.com](https://vercel.com)
- [ ] Import project from Git repository
- [ ] Select correct root directory if needed

### ✅ Environment Variables in Vercel

Add these in Project Settings → Environment Variables:

Production:
- [ ] `NEXT_PUBLIC_APP_URL` → `https://your-domain.com`
- [ ] `NEXT_PUBLIC_SUPABASE_URL` → Your Supabase URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Your Supabase anon key
- [ ] `SUPABASE_SERVICE_ROLE_KEY` → Your Supabase service role key
- [ ] `OPENAI_API_KEY` → Your OpenAI API key

Preview (optional):
- [ ] Same as production but with different Supabase project if needed

Development (optional):
- [ ] Point to localhost URLs

### ✅ Build & Deploy

- [ ] Click "Deploy" in Vercel
- [ ] Wait for build to complete (~2-3 minutes)
- [ ] Check deployment logs for errors
- [ ] Visit preview URL to test

## Post-Deployment Configuration

### ✅ Domain Setup (Optional)

- [ ] Purchase domain from registrar (Namecheap, Google Domains, etc.)
- [ ] Add domain in Vercel Project Settings → Domains
- [ ] Update DNS records (Vercel provides instructions)
- [ ] Wait for DNS propagation (can take 24-48 hours)
- [ ] Update `NEXT_PUBLIC_APP_URL` in Vercel environment variables
- [ ] Redeploy to apply new URL

### ✅ Supabase Production Settings

- [ ] Update "Site URL" to production domain
- [ ] Update "Redirect URLs" to include production domain + `/auth/callback`
- [ ] Test authentication on production
- [ ] Enable email rate limiting
- [ ] Review and adjust database connection limits if needed

### ✅ Production Testing

- [ ] Sign up with test email
- [ ] Verify email works
- [ ] Log in successfully
- [ ] Create a test trip
- [ ] Add cards to trip
- [ ] Test drag & drop
- [ ] Test AI suggestions (Discover page)
- [ ] Test data migration if you have local data
- [ ] Test profile editing
- [ ] Test password reset flow
- [ ] Log out and back in
- [ ] Test on mobile device
- [ ] Test in incognito/private mode

## Monitoring & Maintenance

### ✅ Set Up Monitoring

- [ ] Monitor Vercel deployment logs
- [ ] Monitor Supabase dashboard for errors
- [ ] Check OpenAI usage and costs
- [ ] Set up uptime monitoring (UptimeRobot, Pingdom, etc.)
- [ ] (Optional) Set up Sentry for error tracking

### ✅ Performance Checks

- [ ] Run Lighthouse audit (aim for 90+ score)
  - Performance: 90+
  - Accessibility: 90+
  - Best Practices: 90+
  - SEO: 90+
- [ ] Test page load speeds (<2s)
- [ ] Verify images are optimized
- [ ] Check for console errors in production

### ✅ Security Audit

- [ ] Verify RLS policies prevent unauthorized access
- [ ] Test with multiple user accounts
- [ ] Ensure service role key is not exposed to client
- [ ] HTTPS is enforced (Vercel does this automatically)
- [ ] Test auth edge cases (expired tokens, invalid emails, etc.)

## Launch Checklist

### ✅ Before Public Launch

- [ ] All critical bugs fixed
- [ ] Legal pages reviewed (Terms, Privacy)
- [ ] Support email set up (support@your-domain.com)
- [ ] Backup strategy in place (Supabase auto-backups)
- [ ] Analytics set up (Vercel Analytics or Google Analytics)
- [ ] Social media accounts created (optional)
- [ ] Landing page copy reviewed
- [ ] Demo trip works perfectly

### ✅ Launch Day

- [ ] Final production test (full user journey)
- [ ] Share on social media
- [ ] Post on Product Hunt (if applicable)
- [ ] Email early supporters/beta users
- [ ] Monitor error rates closely
- [ ] Be ready to respond to support requests
- [ ] Celebrate! 🎉

## Ongoing Maintenance

### Daily
- [ ] Check error logs in Vercel
- [ ] Monitor Supabase for issues
- [ ] Respond to user feedback/support

### Weekly
- [ ] Review user analytics
- [ ] Check OpenAI costs
- [ ] Review and address user feedback
- [ ] Plan improvements based on usage

### Monthly
- [ ] Review and optimize database queries
- [ ] Check for security updates
- [ ] Update dependencies (`npm audit fix`)
- [ ] Review and update documentation
- [ ] Plan new features based on user requests

## Rollback Plan

If something goes wrong after deployment:

1. **Quick Fix**: Revert to previous deployment in Vercel
   - Go to Deployments tab
   - Find last working deployment
   - Click "..." → "Promote to Production"

2. **Database Issue**: Restore from Supabase backup
   - Go to Database → Backups
   - Select backup before the issue
   - Restore

3. **Environment Variable Issue**: Double-check all variables
   - Verify no typos
   - Ensure values are correct
   - Redeploy after fixing

## Common Issues & Solutions

### "Invalid JWT" Error
- **Cause**: Wrong Supabase credentials
- **Fix**: Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Authentication Redirect Loop
- **Cause**: Wrong redirect URL in Supabase
- **Fix**: Add `https://your-domain.com/auth/callback` to Supabase redirect URLs

### AI Suggestions Not Working
- **Cause**: OpenAI API key issue or no credits
- **Fix**: Verify API key and check OpenAI dashboard for credits

### Data Migration Fails
- **Cause**: RLS policies or network issue
- **Fix**: Check browser console, verify RLS policies, test with different user

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Tripper Setup Guide**: `SETUP_GUIDE.md`
- **Tripper Issues**: Open a GitHub issue

## Success Metrics

Track these metrics after launch:

- Sign-up rate
- Trips created per user
- AI suggestions usage
- User retention (7-day, 30-day)
- Page load times
- Error rates
- Support ticket volume

---

**Remember**: Launch small, iterate fast, and listen to your users! 🚀

