'use client';

import { useEffect, useState, useRef } from 'react';
import { AlertTriangle, Shield, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { ScreenFlashOverlay } from './ScreenFlashOverlay';

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

// Helper function to check if a point is inside Indian land territory
const isPointInIndianLand = (point: google.maps.LatLng, indianLandData: any): boolean => {
  if (!indianLandData || !indianLandData.features) return false;
  
  for (const feature of indianLandData.features) {
    if (feature.geometry && feature.geometry.coordinates) {
      const coordinates = feature.geometry.coordinates[0]; // Get the outer ring
      const googleCoords = coordinates.map((coord: number[]) => 
        new google.maps.LatLng(coord[1], coord[0]) // Convert [lng, lat] to LatLng
      );
      
      if (isPointInPolygon(point, googleCoords)) {
        return true;
      }
    }
  }
  
  return false;
};

// Helper function to calculate distance from point to polygon boundary
const calculateDistanceToPolygon = (point: google.maps.LatLng, polygon: google.maps.LatLng[]): number => {
  let minDistance = Infinity;
  
  // Calculate distance to each edge of the polygon
  for (let i = 0; i < polygon.length; i++) {
    const j = (i + 1) % polygon.length;
    const distance = distanceToLineSegment(point, polygon[i], polygon[j]);
    minDistance = Math.min(minDistance, distance);
  }
  
  return minDistance;
};

// Helper function to calculate distance from point to line segment
const distanceToLineSegment = (point: google.maps.LatLng, lineStart: google.maps.LatLng, lineEnd: google.maps.LatLng): number => {
  // Convert to simpler coordinate system for calculation
  const px = point.lng();
  const py = point.lat();
  const ax = lineStart.lng();
  const ay = lineStart.lat();
  const bx = lineEnd.lng();
  const by = lineEnd.lat();
  
  // Calculate the distance
  const A = px - ax;
  const B = py - ay;
  const C = bx - ax;
  const D = by - ay;
  
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  
  if (lenSq !== 0) {
    param = dot / lenSq;
  }
  
  let xx, yy;
  
  if (param < 0) {
    xx = ax;
    yy = ay;
  } else if (param > 1) {
    xx = bx;
    yy = by;
  } else {
    xx = ax + param * C;
    yy = ay + param * D;
  }
  
  const dx = px - xx;
  const dy = py - yy;
  
  // Convert to meters using Haversine approximation
  const R = 6371000; // Earth's radius in meters
  const dLat = dy * Math.PI / 180;
  const dLng = dx * Math.PI / 180;
  const lat1 = py * Math.PI / 180;
  const lat2 = yy * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  
  return R * c;
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

// Fetch Indian land boundaries from Natural Earth or OpenStreetMap
const fetchIndianLandBoundary = async (): Promise<any> => {
  try {
    // Using REST Countries API to get India's boundary
    const response = await fetch('https://restcountries.com/v3.1/name/india?fields=cca2,name,latlng');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // For a more accurate boundary, we'll create a simplified polygon covering India
    // This is a simplified approach - in production, you'd want to use proper geospatial data
    const indiaApproximateBoundary = {
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        properties: {
          name: "India Land Territory",
          territory: "India"
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [68.0, 6.0],   // Southwest point
            [97.5, 6.0],   // Southeast point
            [97.5, 37.5],  // Northeast point
            [68.0, 37.5],  // Northwest point
            [68.0, 6.0]    // Close polygon
          ]]
        }
      }]
    };
    
    console.log('Using simplified Indian land boundary');
    return indiaApproximateBoundary;
  } catch (error) {
    console.error('Error fetching Indian land boundary:', error);
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
  const [isFlashing, setIsFlashing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const policeSirenRef = useRef<HTMLAudioElement | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isInsideEEZ, setIsInsideEEZ] = useState<boolean | null>(null);
  const [lastKnownPosition, setLastKnownPosition] = useState<UserLocation | null>(null);
  const [indianLandBoundary, setIndianLandBoundary] = useState<any>(null);

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

  // Load Indian land boundary
  useEffect(() => {
    if (isClient) {
      fetchIndianLandBoundary().then(data => {
        setIndianLandBoundary(data);
        console.log('Indian land boundary loaded');
      });
    }
  }, [isClient]);

  // Convert GeoJSON EEZ data to border alerts
  const createBorderAlertsFromEEZ = (geoJsonData: any): FishingBorderAlert[] => {
    if (!geoJsonData || !geoJsonData.features || !isGoogleMapsLoaded()) {
      return [];
    }

    const borders: FishingBorderAlert[] = [];
    
    geoJsonData.features.forEach((feature: any, index: number) => {
      if (feature.geometry && feature.geometry.coordinates) {
        const geometry = feature.geometry;
        
        // Handle both Polygon and MultiPolygon geometry types
        if (geometry.type === 'MultiPolygon') {
          // For MultiPolygon, process all polygons
          geometry.coordinates.forEach((polygon: any, polygonIndex: number) => {
            if (polygon && polygon[0]) {
              const googleCoords = polygon[0].map((coord: number[]) => 
                new google.maps.LatLng(coord[1], coord[0]) // GeoJSON is [lng, lat], Google Maps is [lat, lng]
              );

              borders.push({
                id: `eez-${index}-${polygonIndex}`,
                name: feature.properties?.geoname || 'Indian Exclusive Economic Zone',
                coordinates: googleCoords,
                description: `Maritime boundary for ${feature.properties?.territory1 || 'India'}. You are outside Indian territorial waters.`,
                alertType: 'warning',
                color: '#FF6B35'
              });
            }
          });
        } else if (geometry.type === 'Polygon') {
          // For simple Polygon
          const polygon = geometry.coordinates;
          if (polygon && polygon[0]) {
            const googleCoords = polygon[0].map((coord: number[]) => 
              new google.maps.LatLng(coord[1], coord[0])
            );

            borders.push({
              id: `eez-${index}`,
              name: feature.properties?.geoname || 'Indian Exclusive Economic Zone',
              coordinates: googleCoords,
              description: `Maritime boundary for ${feature.properties?.territory1 || 'India'}. You are outside Indian territorial waters.`,
              alertType: 'warning',
              color: '#FF6B35'
            });
          }
        }
      }
    });

    console.log(`Processed ${borders.length} EEZ boundary polygons for monitoring`);
    return borders;
  };

  // Initialize audio for siren sounds
  useEffect(() => {
    if (!isClient) return;
    
    // Initialize marine siren (existing)
    audioRef.current = new Audio('/sounds/marine-siren.mp3');
    audioRef.current.preload = 'auto';
    
    // Initialize police siren (new for boundary violations)
    policeSirenRef.current = new Audio('/sounds/police-siren.mp3');
    policeSirenRef.current.preload = 'auto';
    
    // Fallback to browser-generated beep if audio files not available
    if (!audioRef.current.canPlayType('audio/mpeg')) {
      console.warn('Marine siren audio not supported, using fallback alert');
    }
    
    if (!policeSirenRef.current.canPlayType('audio/mpeg')) {
      console.warn('Police siren audio not supported, using fallback alert');
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (policeSirenRef.current) {
        policeSirenRef.current.pause();
        policeSirenRef.current = null;
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

  // Monitor user location for border crossings with continuous tracking
  useEffect(() => {
    if (!isClient || !isGoogleMapsLoaded() || borderData.length === 0) return;

    setIsMonitoring(true);
    
    // Start continuous location monitoring
    if (navigator.geolocation) {
      // Use watchPosition for continuous real-time tracking
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          console.log(`🌍 Live location update: ${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`);
          console.log(`📍 Accuracy: ${position.coords.accuracy} meters`);
          
          // Check boundaries with live location
          checkBorderCrossing(currentLocation);
        },
        (error) => {
          console.error('❌ Error watching live location:', error);
          setIsMonitoring(false);
          
          // Provide specific error feedback
          switch(error.code) {
            case error.PERMISSION_DENIED:
              toast.error('Location permission denied. Cannot monitor EEZ boundaries without location access.');
              break;
            case error.POSITION_UNAVAILABLE:
              toast.error('Location unavailable. Check your GPS settings.');
              break;
            case error.TIMEOUT:
              toast.error('Location timeout. Retrying...');
              break;
          }
        },
        {
          enableHighAccuracy: true,  // Use GPS for best accuracy
          timeout: 10000,            // 10 second timeout
          maximumAge: 5000           // Max 5 seconds old position
        }
      );

      // Also set up a backup interval check every 30 seconds
      const intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const currentLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            console.log(`🔄 Backup location check: ${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}`);
            checkBorderCrossing(currentLocation);
          },
          (error) => {
            console.warn('Backup location check failed:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 10000
          }
        );
      }, 30000); // Every 30 seconds

      return () => {
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        clearInterval(intervalId);
        setIsMonitoring(false);
        console.log('🛑 Stopped live location monitoring');
      };
    } else {
      console.error('❌ Geolocation not supported');
      toast.error('Your device does not support location services. EEZ monitoring disabled.');
      setIsMonitoring(false);
    }
  }, [isClient, borderData, indianLandBoundary]); // Dependencies include boundary data

  const checkBorderCrossing = (location: UserLocation) => {
    if (!isClient || !isGoogleMapsLoaded() || borderData.length === 0) return;

    const googleLocation = new google.maps.LatLng(location.lat, location.lng);
    let currentlyInsideEEZ = false;
    let currentlyInIndianLand = false;
    let distanceToNearestBorder = Infinity;
    let nearestBorderName = '';

    // Check if user is inside ANY EEZ boundary polygon
    borderData.forEach((border) => {
      const isInside = isPointInPolygon(googleLocation, border.coordinates);
      if (isInside) {
        currentlyInsideEEZ = true;
        console.log(`🌊 Location ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)} is inside EEZ: ${border.name}`);
      }
      
      // Calculate distance to border for proximity warnings
      const distance = calculateDistanceToPolygon(googleLocation, border.coordinates);
      if (distance < distanceToNearestBorder) {
        distanceToNearestBorder = distance;
        nearestBorderName = border.name;
      }
    });

    // Check if user is inside Indian land territory
    if (indianLandBoundary) {
      currentlyInIndianLand = isPointInIndianLand(googleLocation, indianLandBoundary);
      if (currentlyInIndianLand) {
        console.log(`🏠 Location ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)} is inside Indian land territory`);
      }
    }

    // User is safe if they are either in EEZ waters OR on Indian land
    const currentlyInSafeZone = currentlyInsideEEZ || currentlyInIndianLand;

    // Track position changes and detect boundary crossings
    setLastKnownPosition(location);

    // Log current status for debugging
    console.log(`📍 Live position: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
    console.log(`🛡️ Safe zone status: EEZ=${currentlyInsideEEZ}, Land=${currentlyInIndianLand}, Safe=${currentlyInSafeZone}`);
    console.log(`📏 Distance to nearest border: ${distanceToNearestBorder.toFixed(0)}m (${nearestBorderName})`);

    // Proximity warnings (warn when approaching border)
    if (currentlyInSafeZone && distanceToNearestBorder < 5000 && distanceToNearestBorder > 1000) { // 5km to 1km range
      const now = Date.now();
      const lastProximityAlert = lastAlertTime['proximity-warning'] || 0;
      
      if (now - lastProximityAlert > 60000) { // Only warn once per minute
        console.warn(`⚠️ Approaching EEZ boundary: ${distanceToNearestBorder.toFixed(0)}m to ${nearestBorderName}`);
        toast.warning('⚠️ Approaching EEZ Boundary', {
          description: `You are ${(distanceToNearestBorder / 1000).toFixed(1)}km from the EEZ boundary. Stay alert!`,
          duration: 5000,
        });
        setLastAlertTime(prev => ({ ...prev, 'proximity-warning': now }));
      }
    }

    // CRITICAL ALERT: If user just left the safe zone
    if (isInsideEEZ === true && !currentlyInSafeZone) {
      const now = Date.now();
      const lastAlert = lastAlertTime['territory-exit'] || 0;
      
      // Immediate alert (no delay for critical safety)
      if (now - lastAlert > 10000) { // 10 second minimum between alerts
        console.error(`🚨 CRITICAL: User LEFT Indian safe zone at ${location.lat}, ${location.lng}`);
        triggerEEZExitAlert(location);
        setLastAlertTime(prev => ({ ...prev, 'territory-exit': now }));
      }
    }
    // WELCOME: If user entered safe zone from outside
    else if (isInsideEEZ === false && currentlyInSafeZone) {
      const now = Date.now();
      const lastAlert = lastAlertTime['territory-enter'] || 0;
      
      if (now - lastAlert > 30000) {
        console.info(`✅ User ENTERED Indian safe zone at ${location.lat}, ${location.lng}`);
        triggerEEZEnterAlert(location, currentlyInIndianLand);
        setLastAlertTime(prev => ({ ...prev, 'territory-enter': now }));
      }
    }
    // Initial state detection
    else if (isInsideEEZ === null) {
      if (!currentlyInSafeZone) {
        console.warn(`⚠️ Initial detection: User is OUTSIDE Indian safe zone at ${location.lat}, ${location.lng}`);
        // Don't trigger alert on app start, just set state
      } else {
        console.info(`✅ Initial detection: User is INSIDE Indian safe zone at ${location.lat}, ${location.lng}`);
      }
    }

    // Update the current safe zone status
    setIsInsideEEZ(currentlyInSafeZone);
  };

  const triggerBorderAlert = async (border: FishingBorderAlert) => {
    if (!isClient) return;
    
    // Play police siren sound with screen flash for critical alerts
    if (border.alertType === 'restricted' || border.alertType === 'international') {
      await playPoliceSirenWithFlash();
    } else {
      // Use regular marine siren for warnings
      await playAlertSound();
    }

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

  const triggerEEZExitAlert = async (location: UserLocation) => {
    if (!isClient) return;
    
    // Play urgent police siren sound with screen flash
    await playPoliceSirenWithFlash();
    
    // Additional urgent beeps after delay
    setTimeout(() => playPoliceSirenWithFlash(), 2000);
    setTimeout(() => playAlertSound(), 4000);

    // Show critical toast notification for leaving EEZ
    toast.error('🚨 CRITICAL: INDIAN TERRITORY BOUNDARY CROSSED!', {
      description: `⚠️ WARNING: You have left Indian territory (land/EEZ) and entered international territory! Current position: ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}. International laws now apply. Return to Indian territory immediately!`,
      duration: 20000, // Show for 20 seconds
      action: {
        label: 'Navigate Back to India',
        onClick: () => {
          toast.info('🧭 Navigate back to Indian territory immediately for your safety and legal compliance.');
        },
      },
    });

    // Send critical push notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('🚨 CRITICAL ALERT: LEFT INDIAN TERRITORY', {
        body: `You have crossed into international territory at ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}. This may violate regulations. Return to Indian territory immediately!`,
        icon: '/icons/alert-icon.svg',
        badge: '/icons/alert-badge.svg',
        tag: 'indian-territory-exit-critical',
        requireInteraction: true,
        silent: false,
      });
    }

    // Very strong vibration pattern for critical alert
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      // Long urgent vibration pattern
      navigator.vibrate([1000, 200, 1000, 200, 1000, 200, 1000]);
    }

    // Log critical alert for compliance and safety
    console.error(`🚨 CRITICAL MARITIME ALERT: User left Indian territory (land/EEZ) at coordinates ${location.lat}, ${location.lng} at ${new Date().toISOString()}`);
    
    // Could integrate with emergency services or fleet management here
    // For example: sendEmergencyAlert(location);
  };

  const triggerEEZEnterAlert = async (location: UserLocation, isOnLand: boolean = false) => {
    if (!isClient) return;
    
    // Play gentle notification sound
    await playWelcomeSound();

    const locationDescription = isOnLand ? 'Indian land territory' : 'Indian territorial waters (EEZ)';

    // Show welcome toast notification for entering safe zone
    toast.success('✅ Entered Indian Safe Zone', {
      description: `Welcome to ${locationDescription}. Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`,
      duration: 8000,
    });

    // Send welcome push notification
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('✅ Welcome to Indian Territory', {
        body: `You have entered ${locationDescription} at ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}. Indian laws apply.`,
        icon: '/icons/alert-icon.svg',
        badge: '/icons/alert-badge.svg',
        tag: 'indian-territory-enter',
        requireInteraction: false,
        silent: true,
      });
    }

    // Gentle vibration for welcome
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }

    // Log entry
    console.info(`User entered Indian safe zone (${locationDescription}) at ${location.lat}, ${location.lng} at ${new Date().toISOString()}`);
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

  const playPoliceSirenWithFlash = async (): Promise<void> => {
    try {
      // Start screen flashing
      setIsFlashing(true);
      
      // Play police siren sound
      if (policeSirenRef.current) {
        policeSirenRef.current.currentTime = 0;
        await policeSirenRef.current.play();
      } else if (audioRef.current) {
        // Fallback to marine siren
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
      } else {
        // Fallback to generated beep
        generateUrgentAlertBeep();
      }
    } catch (error) {
      console.warn('Could not play police siren:', error);
      generateUrgentAlertBeep();
    }
  };

  const playWelcomeSound = async (): Promise<void> => {
    try {
      // Generate a pleasant welcome tone instead of siren
      generateWelcomeBeep();
    } catch (error) {
      console.warn('Could not play welcome sound:', error);
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

  const generateUrgentAlertBeep = () => {
    if (!isClient || typeof window === 'undefined') return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create urgent siren-like sound with alternating frequencies
      const createUrgentTone = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + startTime);
        oscillator.type = 'sawtooth'; // More aggressive sound

        gainNode.gain.setValueAtTime(0.5, audioContext.currentTime + startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);

        oscillator.start(audioContext.currentTime + startTime);
        oscillator.stop(audioContext.currentTime + startTime + duration);
      };

      // Create urgent alternating siren pattern
      createUrgentTone(1000, 0, 0.3);    // High tone
      createUrgentTone(600, 0.3, 0.3);   // Low tone
      createUrgentTone(1000, 0.6, 0.3);  // High tone
      createUrgentTone(600, 0.9, 0.3);   // Low tone
      createUrgentTone(1000, 1.2, 0.3);  // High tone
    } catch (error) {
      console.warn('Could not generate urgent alert beep:', error);
    }
  };

  const generateWelcomeBeep = () => {
    if (!isClient || typeof window === 'undefined') return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a pleasant two-tone welcome sound
      const createTone = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + startTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);

        oscillator.start(audioContext.currentTime + startTime);
        oscillator.stop(audioContext.currentTime + startTime + duration);
      };

      // Play pleasant ascending tones
      createTone(440, 0, 0.3);    // A note
      createTone(554, 0.35, 0.3); // C# note
    } catch (error) {
      console.warn('Could not generate welcome beep:', error);
    }
  };

  const handleFlashComplete = () => {
    setIsFlashing(false);
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
      requestLocationPermission();
    }
  }, [isClient]);

  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      toast.error('Your device does not support location services.');
      return;
    }

    try {
      // Request location permission by trying to get current position
      navigator.geolocation.getCurrentPosition(
        () => {
          console.log('✅ Location permission granted');
          toast.success('Location permission granted. Live border monitoring enabled.');
        },
        (error) => {
          console.error('❌ Location permission denied or failed:', error);
          switch(error.code) {
            case error.PERMISSION_DENIED:
              toast.error('❌ Location permission denied. Please enable location access in your browser settings for live border monitoring.');
              break;
            case error.POSITION_UNAVAILABLE:
              toast.warning('⚠️ Location unavailable. Please check your GPS settings.');
              break;
            case error.TIMEOUT:
              toast.warning('⚠️ Location request timeout. Please try again.');
              break;
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  // Don't render anything if not on client side
  if (!isClient) {
    return null;
  }

  return (
    <>
      {/* Screen Flash Overlay for Boundary Violations */}
      <ScreenFlashOverlay 
        isFlashing={isFlashing}
        flashColor="#FF0000"
        duration={3000}
        intensity={0.7}
        onFlashComplete={handleFlashComplete}
      />
      
      <div className="fishing-border-monitor">
        {isMonitoring && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
              <Shield className="w-4 h-4 animate-pulse" />
              <span>🔴 Live location monitoring active</span>
              <Volume2 className="w-4 h-4" />
            </div>
            {isInsideEEZ !== null && (
              <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-lg border-2 ${
                isInsideEEZ 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700 animate-pulse'
              }`}>
                {isInsideEEZ ? (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>✅ Inside Indian Safe Zone (Land/EEZ)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 animate-bounce" />
                    <span className="font-bold">🚨 OUTSIDE INDIA - INTERNATIONAL TERRITORY!</span>
                  </>
                )}
              </div>
            )}
            {lastKnownPosition && (
              <div className="text-xs text-gray-600 dark:text-gray-400">
                📍 Live GPS: {lastKnownPosition.lat.toFixed(6)}, {lastKnownPosition.lng.toFixed(6)}
                <br />
                🛡️ Monitoring {borderData.length} EEZ boundary polygon(s)
                {indianLandBoundary && <span> + Indian land territory</span>}
              </div>
            )}
            {!isMonitoring && (
              <div className="text-xs text-yellow-600 dark:text-yellow-400">
                ⚠️ Location monitoring disabled - Enable GPS for live border alerts
              </div>
            )}
          </div>
        )}
        {!isMonitoring && (
          <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Border monitoring inactive - Enable location services</span>
          </div>
        )}
      </div>
    </>
  );
};

// Export types for use in other components
export type { FishingBorderAlert, UserLocation };
