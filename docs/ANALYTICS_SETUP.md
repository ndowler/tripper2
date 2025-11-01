# Analytics Setup Guide

## PostHog Configuration

Tripper now has comprehensive analytics tracking via PostHog. This document explains how to set it up and what's being tracked.

## Setup Instructions

### 1. Create a PostHog Account

1. Go to [https://posthog.com](https://posthog.com)
2. Sign up for a free account
3. Create a new project for Tripper
4. Get your Project API Key from Project Settings

### 2. Add Environment Variables

Add these to your `.env.local` file:

```bash
# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

**Note:** The `NEXT_PUBLIC_` prefix means these are exposed to the client-side code. This is safe for PostHog keys as they're designed for client-side use.

### 3. Restart Development Server

```bash
npm run dev
```

### 4. Test Analytics

1. Open the app in your browser
2. You should see a cookie consent banner at the bottom
3. Click "Accept" to enable analytics
4. Perform some actions (create a trip, add cards, use command palette)
5. Check your PostHog dashboard to see events coming in

## What's Being Tracked

### User Acquisition & Onboarding
- `User Signed Up` - New user registration
- `User Logged In` - User authentication
- `Login Failed` - Failed login attempts
- `Signup Failed` - Failed signup attempts
- `Analytics Consent Given` - User accepted analytics

### Trips Management
- `Trip Created` - New trip created
- `Trip Updated` - Trip metadata updated
- `Trip Deleted` - Trip removed
- `Trip Duplicated` - Trip copied

### Days Management
- `Day Created` - New day added to trip
- `Day Deleted` - Day removed from trip
- `Day Reordered` - Days reordered in timeline

### Cards Management
- `Card Created` - New card added (with type, location, etc.)
- `Card Updated` - Card edited (with fields changed)
- `Card Deleted` - Card removed

### Command Palette
- `Command Palette Opened` - Cmd+K pressed or button clicked
- `Command Palette Performance` - Open time tracking
- `Template Selected` - Template chosen from palette
- `AI Category Selected` - AI category selected
- `AI Suggestions Generated` - AI suggestions fetched
- `AI Suggestions Failed` - AI generation error

### AI Discovery
- `Discover Started` - User started discovery flow
- `Discover Completed` - Suggestions generated successfully
- `Discover Failed` - Discovery generation failed
- `Suggestions Saved` - User saved suggestions to trip
- `AI Generation Performance` - Tracks duration and success

### Sessions & Engagement
- `Session Started` - User opens app (with device type, return info)
- `Session Ended` - User closes app (with duration)
- `User Returned` - User returns after being away
- `$pageview` - Page navigation (automatic)

### Performance Metrics
- `Page Loaded` - Page load time, DOM ready, first byte
- `Web Vital: LCP` - Largest Contentful Paint
- `Web Vital: FID` - First Input Delay
- `Web Vital: CLS` - Cumulative Layout Shift
- `Command Palette Performance` - Open time tracking
- `AI Generation Performance` - AI response times

### Errors & Issues
- `Error Occurred` - JavaScript errors
- `API Error` - API failures
- `Validation Error` - Schema validation failures
- `Sync Conflict` - Multi-device sync conflicts

## Privacy & Compliance

### Cookie Consent
- Users see a GDPR-compliant consent banner on first visit
- Analytics only run after explicit consent
- Users can decline analytics (app still works)
- Consent choice is saved in localStorage

### Data Minimization
- No PII (personally identifiable information) in events
- User IDs are hashed
- Destination names are included (non-sensitive)
- Session replay masks all input fields and text

### User Rights
- Users can opt out at any time
- Account deletion removes all analytics data
- Data is stored on PostHog's EU servers (if configured)

## PostHog Features

### Available Features
1. **Product Analytics** - Track user behavior and feature usage
2. **Session Replay** - Watch user sessions (privacy-safe)
3. **Feature Flags** - A/B test new features
4. **Cohort Analysis** - Group users by behavior
5. **Funnels** - Track conversion flows
6. **Dashboards** - Custom analytics views

### Recommended Dashboards

#### 1. Growth Dashboard
- New signups per week
- Signup conversion rate (demo → signup)
- Time to first trip
- Day 7 retention rate
- Day 30 retention rate

#### 2. Feature Adoption Dashboard
- Command Palette usage rate
- AI Discover usage rate
- Drag & drop usage
- Undo/redo usage
- Card type distribution

#### 3. Performance Dashboard
- Average page load time
- AI generation speed
- Command palette open time
- Web Vitals (LCP, FID, CLS)
- Error rate

#### 4. Engagement Dashboard
- Daily/Weekly/Monthly Active Users
- Average session duration
- Cards per trip
- Days per trip
- Trips per user

## Development Mode

In development mode:
- All analytics events are logged to console
- Events are still sent to PostHog (if key is configured)
- Debug mode is enabled for PostHog
- You can test without affecting production data

## Production Deployment

### Checklist
- [ ] PostHog account created
- [ ] Environment variables set in production
- [ ] Cookie consent banner tested
- [ ] Analytics events verified in PostHog dashboard
- [ ] Privacy policy updated with PostHog info
- [ ] GDPR compliance verified

### Environment Variables for Production
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_production_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## Troubleshooting

### Events Not Showing Up
1. Check browser console for "PostHog initialized" log
2. Verify environment variables are set
3. Ensure you've accepted the cookie consent
4. Check PostHog dashboard live events view
5. Wait 1-2 minutes for events to process

### Cookie Consent Not Showing
1. Clear localStorage: `localStorage.clear()`
2. Hard refresh: Ctrl+Shift+R
3. Check browser console for errors

### PostHog Debug Mode
In development, PostHog automatically enables debug mode. Check console for:
- `[Analytics] PostHog initialized`
- `[Analytics] Event Name {properties}`

## Cost Estimates

### Free Tier
- 1 million events per month
- Unlimited projects
- 1 year data retention
- Core features included

### Paid Tier (if needed)
- $0.00031 per event after 1M
- ~$300 for 1M additional events
- 7 years data retention
- Advanced features

### Estimated Usage for Tripper
- 1,000 active users = ~500K events/month (within free tier)
- 10,000 active users = ~5M events/month (~$1,200/month)
- 100,000 active users = ~50M events/month (~$15,000/month)

## Useful PostHog Queries

### New Users This Week
```
event = "User Signed Up"
timestamp > -7d
```

### Command Palette Usage Rate
```
(count where event = "Command Palette Opened") / (count distinct users)
```

### Average AI Generation Time
```
avg(properties.duration) where event = "Discover Completed"
```

### Signup to First Trip Funnel
```
1. User Signed Up
2. Trip Created
```

## Support

- PostHog Docs: https://posthog.com/docs
- PostHog Community: https://posthog.com/community
- PostHog Status: https://status.posthog.com

---

**Last Updated:** November 1, 2025  
**Analytics Version:** 1.0.0  
**PostHog Version:** Latest

