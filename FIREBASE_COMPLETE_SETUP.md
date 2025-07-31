# 🔥 Firebase Setup Guide for MatsyaN-QuarkVerse

## Current Status
✅ Firebase project: `studio-1uekq` is configured
✅ Firebase CLI is installed
✅ Firestore rules are ready
✅ Firebase configuration files exist

## Step-by-Step Setup Process

### 1. Get Your Firebase Configuration
1. Visit: https://console.firebase.google.com/project/studio-1uekq
2. Click the ⚙️ gear icon → Project settings
3. Scroll to "Your apps" section
4. If no web app exists, click "Add app" → Web app
5. Copy the config object that looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "studio-1uekq.firebaseapp.com",
  projectId: "studio-1uekq",
  storageBucket: "studio-1uekq.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 2. Create Your .env.local File
Create `.env.local` in your project root:

```env
# Firebase Configuration (replace with your actual values)
NEXT_PUBLIC_FIREBASE_API_KEY=your-actual-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studio-1uekq.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studio-1uekq
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=studio-1uekq.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# Google Maps Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_GOOGLE_MAP_ID=your-google-map-id

# Google AI Configuration
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

### 3. Enable Firebase Services

In Firebase Console:

#### Authentication
1. Go to Authentication → Sign-in method
2. Enable "Email/Password"
3. (Optional) Enable "Google" sign-in

#### Firestore Database
1. Go to Firestore Database
2. Click "Create database"
3. Choose "Start in test mode"
4. Select your preferred location

#### Storage (for photos)
1. Go to Storage
2. Click "Get started"
3. Choose "Start in test mode"

### 4. Deploy Firebase Configuration

**Login to Firebase:**
```bash
firebase login
```

**Set the active project:**
```bash
firebase use studio-1uekq
```

**Deploy Firestore rules:**
```bash
firebase deploy --only firestore:rules
```

**Deploy Storage rules:**
```bash
firebase deploy --only storage
```

### 5. For Vercel Deployment

Add these environment variables in Vercel dashboard:

1. Go to your Vercel project
2. Settings → Environment Variables
3. Add each variable from your .env.local file

### 6. Test Your Setup

Run your development server:
```bash
npm run dev
```

Check the browser console for any Firebase errors.

### 7. Troubleshooting

**Common Issues:**

1. **"Missing or insufficient permissions"**
   - Deploy Firestore rules: `firebase deploy --only firestore:rules`

2. **"Firebase config not found"**
   - Check your .env.local file exists and has correct values

3. **"Google Maps not loading"**
   - Verify NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set
   - Enable Maps JavaScript API in Google Cloud Console

4. **"Advanced Markers not working"**
   - Create a Map ID in Google Cloud Console
   - Set NEXT_PUBLIC_GOOGLE_MAP_ID environment variable

### 8. Firebase Commands Reference

```bash
# Login
firebase login

# Set project
firebase use studio-1uekq

# Deploy all
firebase deploy

# Deploy specific services
firebase deploy --only firestore:rules
firebase deploy --only hosting
firebase deploy --only storage

# Run emulators (for testing)
firebase emulators:start

# Check project status
firebase projects:list
```

### 9. Security Checklist

✅ Firestore rules restrict access to authenticated users
✅ Storage rules prevent unauthorized uploads
✅ API keys are properly configured
✅ Environment variables are set in production

### 10. Next Steps

1. Complete the environment variable setup
2. Test authentication flow
3. Test fishing trip logging
4. Deploy to production
5. Monitor Firebase usage in console

## Support

If you encounter issues:
1. Check Firebase Console for errors
2. Verify environment variables
3. Check browser console for detailed error messages
4. Ensure all Firebase services are enabled

---

**Your Firebase project**: https://console.firebase.google.com/project/studio-1uekq
