# Vercel Environment Variables Setup

## 🔧 Required Environment Variables for Vercel

Add these in your Vercel Dashboard → Project Settings → Environment Variables:

### Production Environment Variables
```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Maps Configuration
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_MAP_ID=your_google_map_id

# Google Gemini AI Configuration (Server-side only)
GOOGLE_AI_API_KEY=your_gemini_api_key
```

## 🚀 Deployment Workflow

### Step 1: Deploy App to Vercel
```bash
# Option A: Connect GitHub repo to Vercel (Recommended)
# - Go to vercel.com
# - Import your GitHub repository
# - Configure environment variables
# - Deploy automatically on git push

# Option B: Manual deployment
vercel --prod
```

### Step 2: Deploy Firebase Rules
```bash
# This must be done separately from Vercel
firebase deploy --only firestore:rules
```

### Step 3: Configure Vercel Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add all the variables listed above
5. Set them for: Production, Preview, Development

## 🔒 Security Configuration

### Firebase Security Rules (Deploy to Firebase)
Your `firestore.rules` file needs to be deployed to Firebase directly:

```bash
firebase deploy --only firestore:rules
```

### Vercel Domain Configuration
Add your Vercel domain to Firebase:

1. Go to Firebase Console → Authentication
2. Add your Vercel domain to "Authorized domains":
   - `your-app.vercel.app`
   - `your-custom-domain.com` (if using custom domain)

### Google Maps API Key Restrictions
Restrict your Google Maps API key to your Vercel domain:

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Edit your Maps API key
3. Add HTTP referrers:
   - `https://your-app.vercel.app/*`
   - `https://your-custom-domain.com/*` (if applicable)

## 🔄 Continuous Deployment

### Automatic Vercel Deployment
When you push to GitHub, Vercel will automatically:
- ✅ Build and deploy your Next.js app
- ✅ Use the environment variables you configured

### Manual Firebase Rules Updates
When you update Firestore rules, you need to manually deploy:
```bash
firebase deploy --only firestore:rules
```

## 🧪 Testing Production Deployment

1. **Deploy to Vercel**: Your app will be live at `your-app.vercel.app`
2. **Test Authentication**: Verify users can sign in/out
3. **Test Database**: Try creating fishing trips
4. **Check Console**: Ensure no permission errors
5. **Test AI Features**: Verify Gemini AI integration works

## ⚡ Quick Start Commands

```bash
# 1. Deploy app to Vercel
vercel --prod

# 2. Deploy Firebase rules
firebase deploy --only firestore:rules

# 3. Test your live app
open https://your-app.vercel.app
```

## 🐛 Common Issues

### Environment Variables Not Working
- Redeploy after adding environment variables
- Check variable names match exactly (case-sensitive)
- Ensure `NEXT_PUBLIC_` prefix for client-side variables

### Firebase Permission Errors
- Deploy security rules: `firebase deploy --only firestore:rules`
- Add Vercel domain to Firebase authorized domains
- Check user authentication status

### Google Maps Not Loading
- Add Vercel domain to API key restrictions
- Verify Map ID is configured
- Check API quotas and billing
