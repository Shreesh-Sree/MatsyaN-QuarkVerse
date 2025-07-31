#!/bin/bash

# Firebase Setup Script for MatsyaN-QuarkVerse
echo "🔥 Setting up Firebase for MatsyaN-QuarkVerse..."

# Check if logged in
echo "📋 Checking Firebase authentication..."
firebase projects:list

# Set project
echo "🎯 Setting Firebase project to studio-1uekq..."
firebase use studio-1uekq

# Deploy Firestore rules
echo "🛡️ Deploying Firestore security rules..."
firebase deploy --only firestore:rules

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
