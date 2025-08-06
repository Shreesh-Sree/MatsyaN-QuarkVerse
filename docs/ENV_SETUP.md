# Environment Variables Setup

Create a `.env.local` file in the root of your project with the following variables:

## Required Environment Variables

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Google Gemini API
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

## Setup Instructions

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication and Firestore Database
4. Go to Project Settings > General > Your apps
5. Add a web app and copy the configuration values

### 2. Google Maps API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API and Places API
3. Create an API key
4. Restrict the key to your domain (optional but recommended)

### 3. Google Gemini API Setup
1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Copy the API key to your environment variables

## Firebase Database Structure

The application will create the following collections automatically:

### `fishingTrips` Collection
```typescript
{
  id: string,
  userId: string,
  date: string,
  location: {
    lat: number,
    lng: number,
    name: string
  },
  species: string[],
  catch: {
    count: number,
    totalWeight: number,
    averageSize: number
  },
  weatherConditions: {
    temperature: number,
    windSpeed: number,
    visibility: number,
    waveHeight: number
  },
  equipment: string[],
  duration: number,
  success: boolean,
  notes: string,
  photos?: string[],
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `fishingAnalytics` Collection
```typescript
{
  userId: string,
  totalTrips: number,
  successfulTrips: number,
  successRate: number,
  totalCatch: number,
  averageCatchPerTrip: number,
  favoriteSpecies: { [species: string]: number },
  favoriteLocations: { [location: string]: number },
  monthlyStats: { [month: string]: { trips: number, catch: number, success: number } },
  bestPerformingEquipment: { [equipment: string]: number },
  lastUpdated: Timestamp
}
```

## API Integration Features

### Gemini AI Integration
- **Fishing Laws**: Get AI-powered legal advice for fishing regulations by state
- **Safety Guidelines**: Receive comprehensive safety recommendations based on conditions
- **Fishing Insights**: Generate personalized insights from your fishing data

### Firebase Integration
- **Real-time Data**: All fishing data is stored and synced in real-time
- **User Analytics**: Automatic calculation of fishing statistics and trends
- **Offline Support**: Data is cached locally and synced when online

## Security Notes

1. Never commit your `.env.local` file to version control
2. Add `.env.local` to your `.gitignore` file
3. Use environment-specific configurations for production
4. Regularly rotate your API keys
5. Set up Firebase Security Rules for production use

## Firebase Security Rules Example

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own fishing trips
    match /fishingTrips/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Users can only access their own analytics
    match /fishingAnalytics/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```
