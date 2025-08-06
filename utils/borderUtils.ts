/**
 * Border Crossing Utilities
 * 
 * Utilities for detecting when a fishing vessel crosses maritime boundaries
 */

export interface Location {
  lat: number;
  lng: number;
}

export interface BorderCrossingAlert {
  timestamp: number;
  location: Location;
  borderName: string;
  borderType: 'eez' | 'territorial' | 'international';
  severity: 'info' | 'warning' | 'critical';
  message: string;
}

/**
 * Point-in-polygon algorithm for geographic coordinates
 * Uses the ray casting algorithm to determine if a point is inside a polygon
 * 
 * @param point - The point to test
 * @param polygon - Array of coordinates defining the polygon boundary
 * @returns boolean - True if point is inside polygon
 */
export function isPointInPolygon(point: Location, polygon: Location[]): boolean {
  if (polygon.length < 3) return false;

  let isInside = false;
  const { lat, lng } = point;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    if (((yi > lat) !== (yj > lat)) && (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi)) {
      isInside = !isInside;
    }
  }

  return isInside;
}

/**
 * Converts GeoJSON polygon coordinates to Location objects
 * Handles the coordinate order conversion (GeoJSON is [lng, lat], we use [lat, lng])
 * 
 * @param coordinates - GeoJSON coordinates array
 * @returns Location[] - Array of Location objects
 */
export function geoJsonToLocations(coordinates: number[][]): Location[] {
  return coordinates.map(coord => ({
    lat: coord[1], // GeoJSON is [lng, lat]
    lng: coord[0]  // We want [lat, lng]
  }));
}

/**
 * Calculate distance between two points using Haversine formula
 * 
 * @param point1 - First location
 * @param point2 - Second location
 * @returns number - Distance in kilometers
 */
export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(point2.lat - point1.lat);
  const dLng = toRadians(point2.lng - point1.lng);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.lat)) * Math.cos(toRadians(point2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Find the closest point on a polygon boundary to a given point
 * 
 * @param point - The reference point
 * @param polygon - The polygon boundary
 * @returns Location - Closest point on the boundary
 */
export function findClosestBoundaryPoint(point: Location, polygon: Location[]): Location {
  let closestPoint = polygon[0];
  let minDistance = calculateDistance(point, polygon[0]);

  for (let i = 1; i < polygon.length; i++) {
    const distance = calculateDistance(point, polygon[i]);
    if (distance < minDistance) {
      minDistance = distance;
      closestPoint = polygon[i];
    }
  }

  return closestPoint;
}

/**
 * Calculate minimum distance from a point to a polygon boundary
 * 
 * @param point - The point to measure from
 * @param polygon - The polygon boundary
 * @returns number - Distance in kilometers to closest boundary point
 */
export function distanceToBoundary(point: Location, polygon: Location[]): number {
  const closestPoint = findClosestBoundaryPoint(point, polygon);
  return calculateDistance(point, closestPoint);
}

/**
 * Determine if a location is in international waters
 * (This is a simplified check - in reality, this requires complex maritime law)
 * 
 * @param point - Location to check
 * @param eezPolygons - Array of EEZ polygons for relevant countries
 * @returns boolean - True if likely in international waters
 */
export function isInInternationalWaters(point: Location, eezPolygons: Location[][]): boolean {
  // If not in any EEZ, likely international waters
  return !eezPolygons.some(polygon => isPointInPolygon(point, polygon));
}

/**
 * Create a border crossing alert
 * 
 * @param location - Current location
 * @param borderName - Name of the border crossed
 * @param borderType - Type of maritime boundary
 * @param severity - Alert severity level
 * @returns BorderCrossingAlert - Alert object
 */
export function createBorderAlert(
  location: Location,
  borderName: string,
  borderType: 'eez' | 'territorial' | 'international',
  severity: 'info' | 'warning' | 'critical' = 'warning'
): BorderCrossingAlert {
  const messages = {
    eez: 'Entered Exclusive Economic Zone. Fishing regulations may apply.',
    territorial: 'Entered territorial waters. Special permits may be required.',
    international: 'Entered international waters. International fishing laws apply.'
  };

  return {
    timestamp: Date.now(),
    location,
    borderName,
    borderType,
    severity,
    message: messages[borderType]
  };
}

export default {
  isPointInPolygon,
  geoJsonToLocations,
  calculateDistance,
  findClosestBoundaryPoint,
  distanceToBoundary,
  isInInternationalWaters,
  createBorderAlert
};
