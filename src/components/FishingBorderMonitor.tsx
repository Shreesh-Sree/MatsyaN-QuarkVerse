'use client';

import { useEffect, useState, useRef } from 'react';
import { AlertTriangle, Shield, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

interface FishingBorderAlert {
  id: string;
  name: string;
  coordinates: google.maps.LatLng[];
  description: string;
  alertType: 'warning' | 'restricted' | 'international';
  color: string;
}

interface UserLocation {
  lat: number;
  lng: number;
}

interface FishingBorderMonitorProps {
  map: google.maps.Map | null;
  userLocation: UserLocation | null;
  onBorderCrossing?: (border: FishingBorderAlert) => void;
}

// India's fishing borders and maritime boundaries
const INDIA_FISHING_BORDERS: FishingBorderAlert[] = [
  {
    id: 'india-pakistan-border',
    name: 'India-Pakistan Maritime Boundary',
    coordinates: [
      new google.maps.LatLng(23.8, 68.2),
      new google.maps.LatLng(24.0, 68.0),
      new google.maps.LatLng(24.2, 67.8),
      new google.maps.LatLng(24.5, 67.5),
    ],
    description: 'Restricted area - India-Pakistan maritime boundary',
    alertType: 'restricted',
    color: '#FF0000'
  },
  {
    id: 'india-sri-lanka-border',
    name: 'India-Sri Lanka Maritime Boundary',
    coordinates: [
      new google.maps.LatLng(9.8, 79.5),
      new google.maps.LatLng(9.5, 80.0),
      new google.maps.LatLng(8.8, 81.2),
      new google.maps.LatLng(8.0, 81.8),
    ],
    description: 'International waters - India-Sri Lanka boundary',
    alertType: 'international',
    color: '#FFA500'
  },
  {
    id: 'india-eez-west',
    name: 'India EEZ - Western Boundary',
    coordinates: [
      new google.maps.LatLng(23.0, 66.0),
      new google.maps.LatLng(20.0, 65.5),
      new google.maps.LatLng(15.0, 65.0),
      new google.maps.LatLng(10.0, 64.5),
      new google.maps.LatLng(8.0, 65.0),
    ],
    description: 'Exclusive Economic Zone boundary - Western coast',
    alertType: 'warning',
    color: '#FFFF00'
  },
  {
    id: 'india-eez-east',
    name: 'India EEZ - Eastern Boundary',
    coordinates: [
      new google.maps.LatLng(22.0, 92.0),
      new google.maps.LatLng(18.0, 94.0),
      new google.maps.LatLng(15.0, 95.0),
      new google.maps.LatLng(10.0, 94.5),
      new google.maps.LatLng(6.0, 93.0),
    ],
    description: 'Exclusive Economic Zone boundary - Eastern coast',
    alertType: 'warning',
    color: '#FFFF00'
  },
  {
    id: 'andaman-sea-boundary',
    name: 'Andaman Sea International Boundary',
    coordinates: [
      new google.maps.LatLng(14.0, 93.0),
      new google.maps.LatLng(12.0, 95.0),
      new google.maps.LatLng(10.0, 97.0),
      new google.maps.LatLng(8.0, 98.0),
    ],
    description: 'International maritime boundary - Andaman Sea',
    alertType: 'international',
    color: '#FFA500'
  }
];

export const FishingBorderMonitor: React.FC<FishingBorderMonitorProps> = ({
  map,
  userLocation,
  onBorderCrossing
}) => {
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastAlertTime, setLastAlertTime] = useState<{ [key: string]: number }>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const watchIdRef = useRef<number | null>(null);

  // Initialize audio for siren sound
  useEffect(() => {
    audioRef.current = new Audio('/sounds/marine-siren.mp3');
    audioRef.current.preload = 'auto';
    
    // Fallback to browser-generated beep if audio file not available
    if (!audioRef.current.canPlayType('audio/mpeg')) {
      console.warn('Marine siren audio not supported, using fallback alert');
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Draw fishing borders on map
  useEffect(() => {
    if (!map || !window.google) return;

    // Clear existing polygons
    polygons.forEach(polygon => polygon.setMap(null));

    const newPolygons = INDIA_FISHING_BORDERS.map(border => {
      const polygon = new google.maps.Polygon({
        paths: border.coordinates,
        strokeColor: border.color,
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: border.color,
        fillOpacity: 0.2,
        clickable: true,
      });

      // Add info window for border details
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; max-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #333; font-size: 14px;">
              ${border.name}
            </h3>
            <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;">
              ${border.description}
            </p>
            <div style="display: flex; align-items: center; gap: 4px;">
              ${border.alertType === 'restricted' ? 
                '<span style="color: #FF0000;">🚫 Restricted Area</span>' :
                border.alertType === 'international' ?
                '<span style="color: #FFA500;">⚠️ International Waters</span>' :
                '<span style="color: #FFFF00;">⚠️ EEZ Boundary</span>'
              }
            </div>
          </div>
        `
      });

      polygon.addListener('click', (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          infoWindow.setPosition(event.latLng);
          infoWindow.open(map);
        }
      });

      polygon.setMap(map);
      return polygon;
    });

    setPolygons(newPolygons);

    return () => {
      newPolygons.forEach(polygon => polygon.setMap(null));
    };
  }, [map]);

  // Monitor user location for border crossings
  useEffect(() => {
    if (!userLocation || !map) return;

    setIsMonitoring(true);
    
    // Watch for real-time location changes
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          checkBorderCrossing(currentLocation);
        },
        (error) => {
          console.error('Error watching location:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 1000
        }
      );
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsMonitoring(false);
    };
  }, [userLocation, map]);

  const checkBorderCrossing = (location: UserLocation) => {
    if (!window.google) return;

    const userLatLng = new google.maps.LatLng(location.lat, location.lng);

    INDIA_FISHING_BORDERS.forEach((border, index) => {
      const polygon = polygons[index];
      if (!polygon) return;

      // Check if user is inside the border polygon
      const isInside = google.maps.geometry.poly.containsLocation(
        userLatLng,
        polygon
      );

      if (isInside) {
        const now = Date.now();
        const lastAlert = lastAlertTime[border.id] || 0;
        
        // Prevent spam alerts - only alert once every 30 seconds
        if (now - lastAlert > 30000) {
          triggerBorderAlert(border);
          setLastAlertTime(prev => ({
            ...prev,
            [border.id]: now
          }));
        }
      }
    });
  };

  const triggerBorderAlert = async (border: FishingBorderAlert) => {
    // Play siren sound
    await playAlertSound();

    // Show toast notification
    const alertIcon = border.alertType === 'restricted' ? '🚫' : 
                     border.alertType === 'international' ? '⚠️' : '⚠️';
    
    toast.error(`${alertIcon} Maritime Border Alert`, {
      description: `You have crossed into: ${border.name}`,
      duration: 10000,
      action: {
        label: 'Understood',
        onClick: () => {},
      },
    });

    // Request notification permission and send push notification
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🚨 Maritime Border Alert', {
          body: `ALERT: You have crossed into ${border.name}. ${border.description}`,
          icon: '/icons/alert-icon.png',
          badge: '/icons/alert-badge.png',
          tag: `border-alert-${border.id}`,
          requireInteraction: true,
          silent: false,
        });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('🚨 Maritime Border Alert', {
            body: `ALERT: You have crossed into ${border.name}. ${border.description}`,
            icon: '/icons/alert-icon.png',
            badge: '/icons/alert-badge.png',
            tag: `border-alert-${border.id}`,
            requireInteraction: true,
            silent: false,
          });
        }
      }
    }

    // Vibrate device if supported
    if ('vibrate' in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }

    // Call callback if provided
    if (onBorderCrossing) {
      onBorderCrossing(border);
    }

    // Log alert for analytics
    console.warn(`Border crossing alert: ${border.name} at ${new Date().toISOString()}`);
  };

  const playAlertSound = async (): Promise<void> => {
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } else {
        // Fallback to Web Audio API beep
        generateAlertBeep();
      }
    } catch (error) {
      console.warn('Could not play alert sound:', error);
      generateAlertBeep();
    }
  };

  const generateAlertBeep = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.warn('Could not generate alert beep:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  // Request notification permission on component mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="fishing-border-monitor">
      {isMonitoring && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <Shield className="w-4 h-4" />
          <span>Border monitoring active</span>
          <Volume2 className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};

// Export types for use in other components
export type { FishingBorderAlert, UserLocation };
export { INDIA_FISHING_BORDERS };
