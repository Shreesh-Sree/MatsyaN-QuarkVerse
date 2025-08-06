// Google Maps API types for TypeScript
// This file provides type definitions to avoid SSR issues

declare global {
  interface Window {
    google: typeof google;
    initMap: () => void;
  }
}

// Fallback types for when Google Maps is not loaded
export interface GoogleMapsLatLng {
  lat(): number;
  lng(): number;
}

export interface GoogleMapsMap {
  setCenter(latLng: GoogleMapsLatLng | { lat: number; lng: number }): void;
  setZoom(zoom: number): void;
  getCenter(): GoogleMapsLatLng | undefined;
  getZoom(): number | undefined;
}

export interface GoogleMapsPolygon {
  setMap(map: GoogleMapsMap | null): void;
  getPath(): GoogleMapsLatLng[];
}

// Check if Google Maps is available
export const isGoogleMapsLoaded = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof window.google !== 'undefined' && 
         typeof window.google.maps !== 'undefined';
};

// Safe Google Maps LatLng creation
export const createLatLng = (lat: number, lng: number): google.maps.LatLng | null => {
  if (!isGoogleMapsLoaded()) {
    return null;
  }
  return new google.maps.LatLng(lat, lng);
};

// Safe polygon contains check
export const isLocationInPolygon = (
  location: { lat: number; lng: number }, 
  polygon: google.maps.Polygon
): boolean => {
  if (!isGoogleMapsLoaded() || !window.google.maps.geometry) {
    return false;
  }
  
  const latLng = createLatLng(location.lat, location.lng);
  if (!latLng) return false;
  
  try {
    return google.maps.geometry.poly.containsLocation(latLng, polygon);
  } catch (error) {
    console.warn('Error checking polygon containment:', error);
    return false;
  }
};

export default {};
