# Firebase Setup and Security Configuration

## Current Issues
The errors you're seeing are due to Firebase Firestore security rules not being properly configured. Here's how to fix them:

## 1. Firestore Security Rules

You need to deploy the security rules to your Firebase project. The `firestore.rules` file has been created with the following rules:

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
    
    // Allow read access to public data (if any)
    match /publicData/{document=**} {
      allow read: if true;
    }
  }
}
```

## 2. Deploy Security Rules

To deploy these rules to your Firebase project:

### Option A: Using Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### Option B: Using Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Firestore Database
4. Click on "Rules" tab
5. Replace the existing rules with the content from `firestore.rules`
6. Click "Publish"

## 3. Temporary Development Rules (NOT FOR PRODUCTION)

If you want to quickly test the application during development, you can temporarily use these permissive rules (⚠️ **NOT secure for production**):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 4. Authentication Setup

Make sure your Firebase Authentication is properly configured:

1. Go to Firebase Console → Authentication
2. Enable the sign-in methods you want to use (Email/Password, Google, etc.)
3. Ensure users are properly authenticated before accessing Firestore

## 5. Environment Variables

Ensure your Firebase configuration is properly set in your environment:

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 6. Database Structure

The application expects the following Firestore collections:

```
fishingTrips/
├── {tripId}
    ├── userId: string
    ├── date: string
    ├── location: object
    ├── species: array
    ├── catch: object
    ├── weatherConditions: object
    ├── equipment: array
    ├── duration: number
    ├── success: boolean
    ├── notes: string
    ├── createdAt: timestamp
    └── updatedAt: timestamp

fishingAnalytics/
├── {userId}
    ├── totalTrips: number
    ├── successfulTrips: number
    ├── successRate: number
    └── ... (other analytics data)
```

## 7. Testing the Fix

After deploying the security rules:

1. Ensure users are properly authenticated
2. Try creating a fishing trip entry
3. Check that the data is properly saved to Firestore
4. Verify that analytics are calculated correctly

## Troubleshooting

If you still see permission errors:

1. Check that the user is authenticated (`auth.currentUser` is not null)
2. Verify the security rules are deployed
3. Check the browser console for detailed error messages
4. Ensure the document structure matches the security rules

The security rules ensure that:
- Only authenticated users can access data
- Users can only access their own fishing trips and analytics
- The `userId` field in documents matches the authenticated user's ID
