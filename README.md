# GymMate MVP - Setup Guide

A production-ready fitness social platform for finding gym partners.

## 🚀 Features

- **Authentication** - Email signup/login with Supabase
- **Profile Creation** - Multi-step onboarding flow
- **Swipe Matching** - Tinder-style partner discovery
- **Real-time Chat** - Instant messaging between matches
- **Pulse AI** - Fitness chatbot assistant
- **Calorie Scanner** - AI-powered food recognition (coming soon)

## 🛠️ Tech Stack

- **Frontend**: React 19 + Vite
- **Styling**: Tailwind CSS (Teal/Cream theme)
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **AI**: Google Gemini API
- **Animations**: Framer Motion

## 📋 Prerequisites

- Node.js 18+ installed
- Supabase account
- Google Gemini API key (for Pulse AI)

## 🔧 Setup Instructions

### 1. Clone & Install

```bash
cd gym-mate-react
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the schema file: `../gym-mate-schema.sql`
3. Go to Settings → API to get your credentials

### 3. Configure Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## 📁 Project Structure

```
gym-mate-react/
├── src/
│   ├── lib/
│   │   └── supabase.js          # Database helpers
│   ├── pages/
│   │   ├── Auth.jsx             # Login/Signup
│   │   ├── Onboarding.jsx       # Profile creation
│   │   ├── Dashboard.jsx        # Main hub
│   │   ├── Swipe.jsx            # Partner discovery
│   │   ├── Matches.jsx          # Match list
│   │   ├── Chat.jsx             # Real-time messaging
│   │   └── Pulse.jsx            # AI chatbot
│   ├── App.jsx                  # Router
│   └── index.css                # Theme
├── .env                         # API keys
└── package.json
```

## 🎨 Design System

- **Primary Color**: `#2C5F5D` (Teal)
- **Background**: `#FAF7F2` (Cream)
- **Accent**: `#FFB300` (Gold)

## 🔐 Database Schema

The schema includes:
- `profiles` - User profiles
- `swipes` - Swipe actions
- `matches` - Mutual matches
- `messages` - Chat messages
- `pulse_chats` - AI chat history
- `food_logs` - Calorie tracking

All tables have Row Level Security (RLS) enabled.

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy to Vercel
```

Make sure to add environment variables in Vercel dashboard.

## 📝 User Flow

1. **Sign Up** → Email + Password
2. **Onboarding** → 3-step profile creation
3. **Dashboard** → Access all features
4. **Swipe** → Find gym partners
5. **Match** → Get notified of mutual likes
6. **Chat** → Message your matches
7. **Pulse AI** → Get fitness advice

## 🔮 Roadmap

- [ ] Google/Apple OAuth
- [ ] Food calorie scanner (Gemini Vision)
- [ ] Trainer marketplace
- [ ] Stripe subscriptions
- [ ] Admin panel
- [ ] Mobile app (React Native)

## 🐛 Troubleshooting

**Auth not working?**
- Check Supabase URL and keys in `.env`
- Verify email confirmation is disabled in Supabase Auth settings

**Real-time chat not updating?**
- Ensure Supabase Realtime is enabled for the `messages` table

**Swipe not creating matches?**
- Check the `check_and_create_match()` trigger in database

## 📄 License

MIT

## 🤝 Contributing

This is an MVP demo. For production use, add:
- Input validation
- Error boundaries
- Loading states
- Image uploads
- Push notifications
