/**
 * India EEZ Service
 * 
 * Provides access to India's Exclusive Economic Zone (EEZ) boundary data
 * from the Marine Regions database via WFS API
 */

export interface EEZFeature {
  type: 'Feature';
  id: string;
  geometry: {
    type: 'MultiPolygon';
    coordinates: number[][][][];
  };
  properties: {
    mrgid: number;
    geoname: string;
    pol_type: string;
    territory1: string;
    sovereign1: string;
    area_km2: number;
  };
}

export interface EEZData {
  type: 'FeatureCollection';
  features: EEZFeature[];
}

/**
 * Marine Regions API endpoint for India's EEZ
 * MRGID 8480 = India Exclusive Economic Zone
 */
const INDIA_EEZ_API_URL = 'https://geo.vliz.be/geoserver/wfs?request=getfeature&service=wfs&version=1.1.0&typename=MarineRegions:eez&outputformat=json&filter=%3CPropertyIsEqualTo%3E%3CPropertyName%3Emrgid%3C%2FPropertyName%3E%3CLiteral%3E8480%3C%2FLiteral%3E%3C%2FPropertyIsEqualTo%3E';

/**
 * Fetches India's EEZ boundary data from Marine Regions API
 * @returns Promise<EEZData | null> - GeoJSON FeatureCollection or null on error
 */
export async function fetchIndiaEEZBoundary(): Promise<EEZData | null> {
  try {
    const response = await fetch(INDIA_EEZ_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'MatsyaN-QuarkVerse/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Validate response structure
    if (!data || data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
      throw new Error('Invalid EEZ data structure received');
    }

    if (data.features.length === 0) {
      throw new Error('No EEZ features found for India');
    }

    console.log(`Loaded ${data.features.length} EEZ feature(s) for India`);
    return data as EEZData;

  } catch (error) {
    console.error('Error fetching India EEZ boundary:', error);
    return null;
  }
}

/**
 * Validates if a coordinate point is within reasonable bounds for Indian waters
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns boolean - True if within reasonable Indian maritime bounds
 */
export function isWithinIndianWaters(lat: number, lng: number): boolean {
  // Rough bounding box for Indian maritime region
  const BOUNDS = {
    north: 38.0,   // Kashmir region
    south: -15.0,  // Southern Indian Ocean (EEZ extends south)
    west: 60.0,    // Arabian Sea
    east: 100.0    // Bay of Bengal
  };

  return lat >= BOUNDS.south && lat <= BOUNDS.north && 
         lng >= BOUNDS.west && lng <= BOUNDS.east;
}

/**
 * Calculates approximate area of EEZ from GeoJSON data
 * @param eezData - EEZ GeoJSON data
 * @returns number - Area in square kilometers (from properties, not calculated)
 */
export function getEEZArea(eezData: EEZData): number {
  if (!eezData.features || eezData.features.length === 0) {
    return 0;
  }

  // Sum up area from all features
  return eezData.features.reduce((total, feature) => {
    return total + (feature.properties.area_km2 || 0);
  }, 0);
}

/**
 * Extracts basic information about the EEZ
 * @param eezData - EEZ GeoJSON data
 * @returns Object with EEZ information
 */
export function getEEZInfo(eezData: EEZData) {
  if (!eezData.features || eezData.features.length === 0) {
    return null;
  }

  const feature = eezData.features[0]; // Take the first (main) feature
  return {
    name: feature.properties.geoname,
    territory: feature.properties.territory1,
    sovereign: feature.properties.sovereign1,
    type: feature.properties.pol_type,
    areaKm2: feature.properties.area_km2,
    mrgid: feature.properties.mrgid
  };
}

export default {
  fetchIndiaEEZBoundary,
  isWithinIndianWaters,
  getEEZArea,
  getEEZInfo
};
