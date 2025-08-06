#!/bin/bash

# Firebase Setup Script for MatsyaN-QuarkVerse
echo "🔥 Setting up Firebase for MatsyaN-QuarkVerse..."

# Check if logged in
echo "📋 Checking Firebase authentication..."
if ! firebase projects:list > /dev/null 2>&1; then
    echo "❌ Not logged in to Firebase. Please run: firebase login"
    exit 1
fi

# Set project
echo "🎯 Setting Firebase project to studio-1uekq..."
firebase use studio-1uekq

# Check if Firestore database exists
echo "🔍 Checking Firestore database status..."
firebase firestore:databases:list

# Deploy Firestore rules
echo "🛡️ Deploying Firestore security rules..."
if firebase deploy --only firestore:rules; then
    echo "✅ Firestore rules deployed successfully"
else
    echo "❌ Failed to deploy Firestore rules"
    echo "💡 Make sure Firestore database is created in Firebase Console"
    exit 1
fi

# Deploy storage rules
echo "📦 Deploying Storage rules..."
firebase deploy --only storage

# Show project info
echo "✅ Firebase setup complete!"
echo "🌐 Firebase Console: https://console.firebase.google.com/project/studio-1uekq"
echo ""
echo "Next steps:"
echo "1. Update your .env.local file with real Firebase config values"
echo "2. Enable Authentication and Firestore in Firebase Console"
echo "3. Test your application with npm run dev"
