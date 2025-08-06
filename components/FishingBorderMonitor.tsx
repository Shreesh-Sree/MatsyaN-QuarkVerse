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

// Helper function to check if Google Maps is loaded
const isGoogleMapsLoaded = (): boolean => {
  return typeof google !== 'undefined' && google.maps !== undefined;
};

// Helper function to check if a point is inside a polygon
const isPointInPolygon = (point: google.maps.LatLng, polygon: google.maps.LatLng[]): boolean => {
  let isInside = false;
  const lat = point.lat();
  const lng = point.lng();
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng();
    const yi = polygon[i].lat();
    const xj = polygon[j].lng();
    const yj = polygon[j].lat();
    
    if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
      isInside = !isInside;
    }
  }
  
  return isInside;
};

interface FishingBorderMonitorProps {
  map: google.maps.Map | null;
  userLocation: UserLocation | null;
  onBorderCrossing?: (border: FishingBorderAlert) => void;
  eezBoundary?: any; // GeoJSON data from the API
}

// Fetch Indian EEZ boundary from Marine Regions API
const fetchIndianEEZBoundary = async (): Promise<any> => {
  try {
    const response = await fetch('https://geo.vliz.be/geoserver/wfs?request=getfeature&service=wfs&version=1.1.0&typename=MarineRegions:eez&outputformat=json&filter=%3CPropertyIsEqualTo%3E%3CPropertyName%3Emrgid%3C%2FPropertyName%3E%3CLiteral%3E8480%3C%2FLiteral%3E%3C%2FPropertyIsEqualTo%3E');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data && data.type === 'FeatureCollection' && data.features && data.features.length > 0) {
      return data;
    } else {
      throw new Error('Invalid EEZ boundary data received');
    }
  } catch (error) {
    console.error('Error fetching Indian EEZ boundary:', error);
    return null;
  }
};

export const FishingBorderMonitor: React.FC<FishingBorderMonitorProps> = ({
  map,
  userLocation,
  onBorderCrossing,
  eezBoundary
}) => {
  const [polygons, setPolygons] = useState<google.maps.Polygon[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [lastAlertTime, setLastAlertTime] = useState<{ [key: string]: number }>({});
  const [borderData, setBorderData] = useState<FishingBorderAlert[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure this only runs on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize border data when Google Maps is available
  useEffect(() => {
    if (isClient && isGoogleMapsLoaded() && eezBoundary) {
      // Convert GeoJSON EEZ boundary to border alerts
      const borders = createBorderAlertsFromEEZ(eezBoundary);
      setBorderData(borders);
    }
  }, [isClient, map, eezBoundary]);

  // Convert GeoJSON EEZ data to border alerts
  const createBorderAlertsFromEEZ = (geoJsonData: any): FishingBorderAlert[] => {
    if (!geoJsonData || !geoJsonData.features || !isGoogleMapsLoaded()) {
      return [];
    }

    const borders: FishingBorderAlert[] = [];
    
    geoJsonData.features.forEach((feature: any, index: number) => {
      if (feature.geometry && feature.geometry.coordinates) {
        // Handle MultiPolygon geometry
        const coordinates = feature.geometry.coordinates;
        
        // For MultiPolygon, take the first (usually largest) polygon
        const mainPolygon = coordinates[0];
        if (mainPolygon && mainPolygon[0]) {
          const googleCoords = mainPolygon[0].map((coord: number[]) => 
            new google.maps.LatLng(coord[1], coord[0]) // Note: GeoJSON is [lng, lat], Google Maps is [lat, lng]
          );

          borders.push({
            id: `eez-${index}`,
            name: feature.properties?.geoname || 'Indian Exclusive Economic Zone',
            coordinates: googleCoords,
            description: `Maritime boundary for ${feature.properties?.territory1 || 'India'}. Fishing restrictions may apply.`,
            alertType: 'warning',
            color: '#FF6B35'
          });
        }
      }
    });

    return borders;
  };

  // Initialize audio for siren sound
  useEffect(() => {
    if (!isClient) return;
    
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
  }, [isClient]);

  // Draw fishing borders on map
  useEffect(() => {
    if (!map || !isClient || !isGoogleMapsLoaded() || borderData.length === 0) return;

    // Clear existing polygons
    polygons.forEach(polygon => polygon.setMap(null));

    const newPolygons = borderData.map(border => {
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
  }, [map, borderData, isClient]);

  // Monitor user location for border crossings
  useEffect(() => {
    if (!userLocation || !map || !isClient) return;

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
  }, [userLocation, map, isClient]);

  const checkBorderCrossing = (location: UserLocation) => {
    if (!isClient || !isGoogleMapsLoaded()) return;

    borderData.forEach((border) => {
      // Check if user is inside the border polygon using the border coordinates
      const googleLocation = new google.maps.LatLng(location.lat, location.lng);
      const isInside = isPointInPolygon(googleLocation, border.coordinates);

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
    if (!isClient) return;
    
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
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🚨 Maritime Border Alert', {
          body: `ALERT: You have crossed into ${border.name}. ${border.description}`,
          icon: '/icons/alert-icon.svg',
          badge: '/icons/alert-badge.svg',
          tag: `border-alert-${border.id}`,
          requireInteraction: true,
          silent: false,
        });
      } else if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          new Notification('🚨 Maritime Border Alert', {
            body: `ALERT: You have crossed into ${border.name}. ${border.description}`,
            icon: '/icons/alert-icon.svg',
            badge: '/icons/alert-badge.svg',
            tag: `border-alert-${border.id}`,
            requireInteraction: true,
            silent: false,
          });
        }
      }
    }

    // Vibrate device if supported
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
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
    if (!isClient || typeof window === 'undefined') return;
    
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
    if (isClient && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  // Request notification permission on component mount
  useEffect(() => {
    if (isClient) {
      requestNotificationPermission();
    }
  }, [isClient]);

  // Don't render anything if not on client side
  if (!isClient) {
    return null;
  }

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
