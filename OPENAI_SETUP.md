# OpenAI API Setup

Tripper now uses OpenAI's GPT-4o-mini to generate intelligent travel suggestions!

## Setup Instructions

### 1. Get an OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Navigate to "API Keys" in the left sidebar
4. Click "Create new secret key"
5. Copy the key (you won't be able to see it again!)

### 2. Create Environment File

Create a file called `.env.local` in the project root:

```bash
# Create the file
touch .env.local
```

Add your API key to `.env.local`:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

⚠️ **Important:** Never commit `.env.local` to git! It's already in `.gitignore`.

### 3. Restart Development Server

If the dev server is running, restart it to load the environment variables:

```bash
npm run dev
```

## How It Works

### User Flow

1. Press `Cmd+K` to open command palette
2. Click the "AI" tab
3. Select a category (Activities, Food, Hotels, etc.)
4. Choose a prompt (e.g., "popular attractions")
5. Wait 2-3 seconds for AI to generate suggestions
6. Review 3 AI-generated suggestions with descriptions
7. Click to toggle selection (all are selected by default)
8. Click "Add Selected Suggestions" to add them to your trip

### AI Response Format

The AI returns 3 suggestions, each with:
- **Title** - Specific name or activity
- **Description** - Brief 1-2 sentence explanation
- **Type** - Card type (activity, restaurant, hotel, etc.)
- **Duration** - Estimated time in minutes
- **Tags** - Relevant tags for filtering
- **Location** - Specific location when applicable

### Example Response

For "popular attractions in Rome":

```json
{
  "suggestions": [
    {
      "type": "activity",
      "title": "Colosseum & Roman Forum",
      "description": "Explore ancient Rome's most iconic amphitheater and the ruins of the Roman Forum. Book skip-the-line tickets in advance.",
      "duration": 180,
      "tags": ["ancient-history", "must-see", "UNESCO"],
      "location": "Piazza del Colosseo, 1"
    },
    {
      "type": "activity",
      "title": "Vatican Museums & Sistine Chapel",
      "description": "Marvel at Michelangelo's frescoes and the world's greatest art collection. Visit early morning to avoid crowds.",
      "duration": 240,
      "tags": ["art", "religion", "must-see"],
      "location": "Vatican City"
    },
    {
      "type": "activity",
      "title": "Trevi Fountain & Spanish Steps",
      "description": "Toss a coin in Rome's most beautiful fountain and climb the iconic Spanish Steps. Best visited at sunrise or evening.",
      "duration": 90,
      "tags": ["landmark", "photo-spot", "free"],
      "location": "Piazza di Trevi"
    }
  ]
}
```

## API Details

### Model

We use `gpt-4o-mini` which offers:
- ✅ Fast responses (2-3 seconds)
- ✅ Low cost (~$0.0001 per request)
- ✅ High quality suggestions
- ✅ JSON structured output

### Cost Estimation

Typical usage costs:
- **Per AI query:** ~$0.0001 USD
- **100 queries:** ~$0.01 USD  
- **1,000 queries:** ~$0.10 USD

Very affordable for personal use! 💰

### Rate Limits

OpenAI free tier:
- **3 requests per minute**
- **200 requests per day**

Paid tier (pay-as-you-go):
- **60 requests per minute**
- **10,000 requests per day**

## Troubleshooting

### "OpenAI API key not configured"

Your `.env.local` file is missing or the API key isn't set.

**Solution:** Create `.env.local` with your API key and restart the dev server.

### "Invalid OpenAI API key"

Your API key is incorrect or expired.

**Solution:** 
1. Check for typos in `.env.local`
2. Generate a new key from OpenAI Platform
3. Update `.env.local` and restart

### "Rate limit exceeded"

You've hit OpenAI's rate limits.

**Solution:**
- Wait a minute before trying again
- Upgrade to paid tier for higher limits
- Spread out your requests

### AI returns generic suggestions

The AI couldn't find specific information about the destination.

**Solution:**
- Use more specific trip titles (e.g., "Rome 2025" instead of "Trip")
- Try different prompts
- Edit the suggestions after adding them

## Privacy & Security

### What data is sent to OpenAI?

- Destination (trip title)
- Category (activities, food, etc.)
- Prompt (e.g., "popular attractions")

### What's NOT sent?

- Your existing cards
- Personal information
- Email or account details
- Any other trip data

### API Key Security

- ✅ API calls are made from the server (Next.js API route)
- ✅ API key never exposed to the browser
- ✅ `.env.local` is gitignored
- ⚠️ Don't share your API key
- ⚠️ Don't commit `.env.local` to git

## Fallback Behavior

If the OpenAI API is unavailable or not configured:
- You'll see an error toast
- The command palette returns to category selection
- Template system still works perfectly
- No data is lost

## Future Enhancements

Potential improvements:
- 🎯 Learning from your preferences
- 🌍 Real-time pricing information
- 📍 Integration with Maps API
- ⭐ User reviews and ratings
- 🗓️ Event calendar integration
- 🎨 Image generation for destinations

## Support

Having issues? Check:
1. [OpenAI Status Page](https://status.openai.com/)
2. [OpenAI API Documentation](https://platform.openai.com/docs)
3. Your API key is valid and has credits

---

**Happy planning with AI! ✈️🤖**
