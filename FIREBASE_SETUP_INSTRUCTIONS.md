# Firebase Setup Instructions

## 🔥 Firebase Project Setup

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Login to Firebase
```bash
firebase login
```

### Step 3: Connect to Your Firebase Project
Replace `your-firebase-project-id` with your actual Firebase project ID:

```bash
# Option A: Use existing project
firebase use your-firebase-project-id

# Option B: Create and use new project
firebase projects:create your-new-project-id
firebase use your-new-project-id
```

### Step 4: Update .firebaserc
Edit `.firebaserc` and replace `your-firebase-project-id` with your actual project ID:

```json
{
  "projects": {
    "default": "your-actual-firebase-project-id"
  }
}
```

### Step 5: Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Step 6: Deploy Firestore Indexes (if needed)
```bash
firebase deploy --only firestore:indexes
```

## 🚀 Alternative: Manual Setup via Firebase Console

If you prefer to set up rules manually:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Firestore Database → Rules
4. Copy the content from `firestore.rules` and paste it
5. Click "Publish"

## 🧪 Testing with Firebase Emulator (Optional)

For local development and testing:

```bash
# Start emulators
firebase emulators:start

# Your app will run against local emulators
# Firestore: http://localhost:8080
# Auth: http://localhost:9099
# UI: http://localhost:4000
```

## ✅ Verify Setup

After deployment, test your rules:

1. Open your app
2. Try to create a fishing trip (should work when authenticated)
3. Check browser console for any permission errors
4. Verify data appears in Firestore console

## 🔧 Troubleshooting

### "Project not found" error:
- Check if project ID in `.firebaserc` matches your Firebase project
- Run `firebase projects:list` to see available projects

### "Permission denied" errors:
- Ensure you're logged into Firebase CLI: `firebase login`
- Check that rules are deployed: `firebase deploy --only firestore:rules`
- Verify user is authenticated in your app

### "Rules not updating":
- Wait a few minutes after deployment
- Check Firebase Console → Firestore → Rules to verify deployment
- Clear browser cache and reload app
