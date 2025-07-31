# Environment Setup Guide

## 🔐 Environment Variables Configuration

This guide explains how to properly set up environment variables for the MatsyaN QuarkVerse application.

## 📋 Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** with your actual API keys (never commit this file!)

3. **Get API Keys** from the following services:

## 🔑 Required API Keys

### 1. Google AI Studio API Key (Gemini)
- **Variable**: `GOOGLE_AI_API_KEY`
- **Get it from**: [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Used for**: AI-powered fishing laws, safety guidelines, and data insights

### 2. Google Maps API Key  
- **Variable**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- **Get it from**: [Google Cloud Console - Maps](https://console.cloud.google.com/google/maps-apis)
- **Used for**: Interactive maps and location features
- **APIs needed**: Maps JavaScript API, Places API (New), Geocoding API

### 3. Google Maps Map ID
- **Variable**: `NEXT_PUBLIC_GOOGLE_MAP_ID`
- **Get it from**: Google Cloud Console → Maps → Map Management → Create Map ID
- **Type**: Vector map type
- **Used for**: Advanced marker functionality and modern map features

### 4. Firebase Configuration
- **Get from**: [Firebase Console](https://console.firebase.google.com/)
- **Required variables**:
  ```bash
  NEXT_PUBLIC_FIREBASE_API_KEY=
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
  NEXT_PUBLIC_FIREBASE_APP_ID=
  ```
- **Used for**: User authentication, fishing trip data storage, and analytics

## 🛡️ Firebase Security Setup

### Firestore Security Rules
Deploy these rules to your Firebase project:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /fishingTrips/{tripId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Analytics data - users can only access their own
    match /fishingAnalytics/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User profiles
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Deploy Security Rules
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```

## 📊 Database Structure

### Firestore Collections

#### `fishingTrips` Collection
```javascript
{
  id: "auto-generated",
  userId: "user_uid",
  date: "2025-07-31",
  location: {
    name: "Marina Bay",
    lat: 1.2966,
    lng: 103.8764
  },
  species: ["Bass", "Trout"],
  catch: {
    count: 5,
    totalWeight: 2.5,
    averageSize: 25.0
  },
  weatherConditions: {
    temperature: 28,
    windSpeed: 10,
    visibility: 15,
    waveHeight: 1.2
  },
  equipment: ["Rod & Reel", "Fishing Line", "Hooks"],
  duration: 4.0,
  success: true,
  notes: "Great fishing spot with calm waters",
  createdAt: "timestamp",
  updatedAt: "timestamp"
}
```

## 🚫 Security Best Practices

### ❌ Never Do This:
- Commit `.env.local` or any file with real API keys
- Share API keys in chat, email, or documentation
- Use production keys in development
- Hardcode API keys in source code

### ✅ Always Do This:
- Use separate API keys for development and production
- Restrict API keys to specific domains
- Regularly rotate API keys
- Monitor API usage and quotas

### ✅ Always Do This:
- Use `.env.local` for local development
- Keep API keys in environment variables
- Use different keys for different environments
- Rotate keys regularly
- Check `.gitignore` includes `.env.local`

## 🛠️ Troubleshooting

### Missing API Keys
If you see errors about missing API keys:

1. **Check file exists**: Ensure `.env.local` exists
2. **Check variable names**: Match exactly as shown in `.env.example`
3. **Restart server**: After adding keys, restart the development server
4. **Check console**: Look for specific error messages

### API Key Not Working
1. **Verify key format**: Copy entire key without spaces
2. **Check permissions**: Ensure APIs are enabled in respective consoles
3. **Check quotas**: Verify you haven't exceeded API limits
4. **Test keys**: Use API testing tools to verify keys work

## 📚 Environment Files

- **`.env.example`** - Template with placeholder values (committed to repo)
- **`.env.local`** - Your actual keys (never committed, gitignored)
- **`.env.production`** - Production keys (deploy separately)

## 🔄 Development Workflow

1. Clone repository
2. Copy `.env.example` to `.env.local`
3. Fill in your API keys
4. Run `npm run dev`
5. Test features requiring APIs

---

**Note**: If you accidentally commit API keys, immediately rotate them in the respective service consoles!
