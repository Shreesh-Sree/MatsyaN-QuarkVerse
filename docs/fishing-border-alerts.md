# 🚨 Fishing Border Alert System

## Overview

The Fishing Border Alert System is a critical safety feature that monitors fishermen's location in real-time and alerts them when they cross into restricted or international maritime boundaries. This helps prevent legal issues, safety risks, and potential international incidents.

## Features

### 🗺️ Interactive Border Visualization
- **Real-time Border Display**: India's maritime boundaries are highlighted on the map with color-coded zones
- **Multiple Border Types**:
  - 🔴 **Restricted Areas** (Red) - India-Pakistan maritime boundary
  - 🟠 **International Waters** (Orange) - India-Sri Lanka, Andaman Sea boundaries  
  - 🟡 **EEZ Boundaries** (Yellow) - Exclusive Economic Zone limits

### 🚨 Multi-Modal Alert System
- **Visual Alerts**: Toast notifications with border crossing information
- **Audio Alerts**: Marine siren sound (3-second duration)
- **Push Notifications**: Browser notifications with maritime warning
- **Haptic Feedback**: Device vibration (if supported)

### 📍 Precise Location Monitoring
- **High-Accuracy GPS**: Uses `enableHighAccuracy: true` for precise positioning
- **Real-time Tracking**: Continuous location monitoring with 1-second updates
- **Geometric Analysis**: Uses Google Maps Geometry API for accurate border detection

## Technical Implementation

### Border Definitions

```typescript
interface FishingBorderAlert {
  id: string;
  name: string;
  coordinates: google.maps.LatLng[];
  description: string;
  alertType: 'warning' | 'restricted' | 'international';
  color: string;
}
```

### Configured Borders

1. **India-Pakistan Maritime Boundary**
   - Type: Restricted (Red)
   - Coordinates: Northwestern coastal waters
   - Alert: High-priority restricted area warning

2. **India-Sri Lanka Maritime Boundary**
   - Type: International (Orange)
   - Coordinates: Southeastern waters near Palk Strait
   - Alert: International waters notification

3. **India EEZ - Western Boundary**
   - Type: Warning (Yellow)
   - Coordinates: Arabian Sea EEZ limits
   - Alert: Exclusive Economic Zone boundary

4. **India EEZ - Eastern Boundary**
   - Type: Warning (Yellow)
   - Coordinates: Bay of Bengal EEZ limits
   - Alert: Exclusive Economic Zone boundary

5. **Andaman Sea International Boundary**
   - Type: International (Orange)
   - Coordinates: Eastern Andaman Sea
   - Alert: International maritime boundary

### Alert Mechanisms

#### 1. Audio Alerts
```typescript
// Marine siren generation
const generateAlertBeep = () => {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.type = 'sine';
  // Plays for 1 second with exponential fade
};
```

#### 2. Push Notifications
```typescript
new Notification('🚨 Maritime Border Alert', {
  body: `ALERT: You have crossed into ${border.name}`,
  icon: '/icons/alert-icon.png',
  badge: '/icons/alert-badge.png',
  requireInteraction: true,
  silent: false,
});
```

#### 3. Haptic Feedback
```typescript
// Vibration pattern: 200ms on, 100ms off, repeated
navigator.vibrate([200, 100, 200, 100, 200]);
```

### Alert Throttling
- **30-second cooldown** between alerts for the same border
- Prevents spam notifications during border area navigation
- Maintains alert effectiveness without overwhelming users

## Usage

### Integration in GoogleMapCard

```tsx
import { FishingBorderMonitor } from './FishingBorderMonitor';

// In your component
<FishingBorderMonitor 
  map={googleMapRef.current}
  userLocation={userLocation}
  onBorderCrossing={handleBorderCrossing}
/>
```

### Custom Border Crossing Handler

```typescript
const handleBorderCrossing = (border: FishingBorderAlert) => {
  console.log(`Border crossing detected: ${border.name}`);
  setBorderAlerts(prev => [...prev, border]);
  
  // Custom analytics or logging
  logBorderCrossing(border);
  
  // Emergency contact notification (if needed)
  if (border.alertType === 'restricted') {
    notifyEmergencyContacts(border);
  }
};
```

## Setup Requirements

### 1. Google Maps API Configuration
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key
```

**Required APIs:**
- Maps JavaScript API
- Geometry Library
- Places API (optional, for enhanced location data)

### 2. Audio Files
Place marine siren audio file at:
```
/public/sounds/marine-siren.mp3
```

Alternative: Uses Web Audio API fallback if file unavailable

### 3. Notification Icons
```
/public/icons/alert-icon.svg    # 64x64 notification icon
/public/icons/alert-badge.svg   # 32x32 badge icon
```

### 4. Dependencies
```json
{
  "sonner": "^1.5.0"  // For toast notifications
}
```

## Browser Permissions

### Required Permissions
1. **Geolocation**: For real-time position tracking
2. **Notifications**: For push alerts (requested automatically)

### Permission Handling
```typescript
// Automatic permission request on component mount
useEffect(() => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}, []);
```

## Safety Features

### 1. Fallback Mechanisms
- **No GPS**: Uses last known location with warning
- **No Audio**: Falls back to Web Audio API beep
- **No Notifications**: Shows toast-only alerts

### 2. Error Handling
- Graceful degradation if Google Maps fails to load
- Console warnings for debugging
- Non-blocking errors (doesn't crash the app)

### 3. Privacy
- Location data processed locally
- No transmission to external servers
- Real-time monitoring only while app is active

## Legal Compliance

### Maritime Law Awareness
- **UNCLOS (UN Convention on Law of the Sea)** compliance
- **Indian Maritime Zones Act** boundaries
- **Bilateral agreements** with neighboring countries

### Important Notes
- Border coordinates are approximate and for guidance only
- Always verify with official maritime authorities
- This system supplements but doesn't replace official navigation
- Fishermen should carry proper licenses and documentation

## Performance Optimization

### 1. Efficient Monitoring
```typescript
// Optimized geolocation watching
navigator.geolocation.watchPosition(callback, errorCallback, {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 1000  // 1-second cache for battery efficiency
});
```

### 2. Memory Management
- Automatic cleanup of geolocation watchers
- Polygon removal on component unmount
- Audio context management

### 3. Network Efficiency
- Borders loaded once on map initialization
- Local geometric calculations (no server calls)
- Cached audio files for instant playback

## Testing

### Test Scenarios
1. **Border Crossing Simulation**: Test with mock GPS coordinates
2. **Permission Handling**: Test with blocked/allowed permissions
3. **Audio Playback**: Verify siren in different browsers
4. **Notification Display**: Test across devices and browsers

### Debug Features
```typescript
// Enable detailed logging
const DEBUG_BORDERS = process.env.NODE_ENV === 'development';

if (DEBUG_BORDERS) {
  console.log('Border crossing debug info:', {
    userLocation,
    borderName: border.name,
    timestamp: new Date().toISOString()
  });
}
```

## Future Enhancements

### Planned Features
1. **Dynamic Border Updates**: Fetch latest boundaries from maritime authorities
2. **Weather Integration**: Enhanced alerts during rough weather
3. **Vessel Type Considerations**: Different rules for different fishing vessel sizes
4. **Offline Capability**: Cached borders for offline navigation
5. **Emergency Integration**: Direct connection to coast guard services

### Advanced Analytics
- Border crossing frequency analysis
- High-risk area identification
- Compliance reporting for fishing cooperatives
- Integration with fishing license systems

## Troubleshooting

### Common Issues

1. **Alerts Not Triggering**
   - Check geolocation permissions
   - Verify Google Maps API key
   - Ensure geometry library is loaded

2. **No Audio Alerts**
   - Check browser autoplay policies
   - Verify audio file path
   - Test Web Audio API fallback

3. **Inaccurate Border Detection**
   - Confirm GPS accuracy settings
   - Check coordinate system compatibility
   - Verify polygon coordinate ordering

### Support Commands
```bash
# Test audio generation
npm run test:audio

# Validate border coordinates
npm run validate:borders

# Check permissions
npm run check:permissions
```

---

## 🚨 Important Safety Notice

This border alert system is designed to assist fishermen but should NOT be the sole means of navigation or legal compliance. Always:

- Carry official navigation equipment
- Maintain current fishing licenses
- Follow local maritime authority guidelines
- Report any system malfunctions immediately

**Emergency Contact**: Coast Guard - 1554 (India)

---

*This system is continuously updated to reflect current maritime boundaries and regulations.*
