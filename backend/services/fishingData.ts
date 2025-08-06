"use client";

import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { FishingDataEntry } from '@/services/gemini';

export interface FishingTrip extends Omit<FishingDataEntry, 'createdAt' | 'updatedAt'> {
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface FishingAnalytics {
  totalTrips: number;
  successfulTrips: number;
  successRate: number;
  totalCatch: number;
  averageCatchPerTrip: number;
  favoriteSpecies: { [species: string]: number };
  favoriteLocations: { [location: string]: number };
  monthlyStats: { [month: string]: { trips: number; catch: number; success: number } };
  bestPerformingEquipment: { [equipment: string]: number };
}

export interface WeatherAnalytics {
  optimalConditions: {
    temperature: { min: number; max: number };
    windSpeed: { min: number; max: number };
    visibility: { min: number; max: number };
  };
  seasonalTrends: { [season: string]: { successRate: number; avgCatch: number } };
}

export class FishingDataService {
  private readonly COLLECTION_NAME = 'fishingTrips';
  private readonly ANALYTICS_COLLECTION = 'fishingAnalytics';

  async createFishingTrip(userId: string, tripData: Omit<FishingTrip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const trip: FishingTrip = {
        ...tripData,
        userId,
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
      };

      const docRef = await addDoc(collection(db, this.COLLECTION_NAME), trip);
      
      // Update user analytics
      await this.updateUserAnalytics(userId);
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating fishing trip:', error);
      throw new Error('Failed to save fishing trip');
    }
  }

  async getFishingTrips(userId: string, limitCount: number = 50): Promise<FishingDataEntry[]> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        limit(limitCount)
      );

      const querySnapshot = await getDocs(q);
      const trips: FishingDataEntry[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FishingTrip;
        trips.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString(),
        });
      });

      // Sort by creation date on client side to avoid needing composite index
      trips.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return trips;
    } catch (error: any) {
      console.error('Error fetching fishing trips:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Access denied. Please ensure you are logged in and have proper permissions.');
      }
      throw new Error('Failed to fetch fishing trips');
    }
  }

  // Add a method to get trips with better error handling
  async getUserFishingTrips(userId: string): Promise<FishingDataEntry[]> {
    return this.getFishingTrips(userId);
  }

  async updateFishingTrip(tripId: string, updates: Partial<FishingTrip>): Promise<void> {
    try {
      const tripRef = doc(db, this.COLLECTION_NAME, tripId);
      await updateDoc(tripRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });

      // Get userId and update analytics
      const tripDoc = await getDoc(tripRef);
      if (tripDoc.exists()) {
        const tripData = tripDoc.data() as FishingTrip;
        await this.updateUserAnalytics(tripData.userId);
      }
    } catch (error) {
      console.error('Error updating fishing trip:', error);
      throw new Error('Failed to update fishing trip');
    }
  }

  async deleteFishingTrip(tripId: string): Promise<void> {
    try {
      const tripRef = doc(db, this.COLLECTION_NAME, tripId);
      
      // Get userId before deletion for analytics update
      const tripDoc = await getDoc(tripRef);
      let userId = '';
      if (tripDoc.exists()) {
        const tripData = tripDoc.data() as FishingTrip;
        userId = tripData.userId;
      }

      await deleteDoc(tripRef);

      // Update analytics if we have userId
      if (userId) {
        await this.updateUserAnalytics(userId);
      }
    } catch (error) {
      console.error('Error deleting fishing trip:', error);
      throw new Error('Failed to delete fishing trip');
    }
  }

  async getFishingAnalytics(userId: string): Promise<FishingAnalytics> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const trips = await this.getFishingTrips(userId);
      
      const analytics: FishingAnalytics = {
        totalTrips: trips.length,
        successfulTrips: trips.filter(trip => trip.success).length,
        successRate: trips.length > 0 ? trips.filter(trip => trip.success).length / trips.length : 0,
        totalCatch: trips.reduce((sum, trip) => sum + trip.catch.count, 0),
        averageCatchPerTrip: trips.length > 0 ? trips.reduce((sum, trip) => sum + trip.catch.count, 0) / trips.length : 0,
        favoriteSpecies: this.calculateSpeciesFrequency(trips),
        favoriteLocations: this.calculateLocationFrequency(trips),
        monthlyStats: this.calculateMonthlyStats(trips),
        bestPerformingEquipment: this.calculateEquipmentPerformance(trips),
      };

      return analytics;
    } catch (error: any) {
      console.error('Error calculating fishing analytics:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Access denied. Please ensure you are logged in and have proper permissions.');
      }
      throw new Error('Failed to calculate analytics');
    }
  }

  async getWeatherAnalytics(userId: string): Promise<WeatherAnalytics> {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const trips = await this.getFishingTrips(userId);
      const successfulTrips = trips.filter(trip => trip.success);

      if (successfulTrips.length === 0) {
        return {
          optimalConditions: {
            temperature: { min: 20, max: 30 },
            windSpeed: { min: 0, max: 15 },
            visibility: { min: 5, max: 10 },
          },
          seasonalTrends: {},
        };
      }

      const temperatures = successfulTrips.map(trip => trip.weatherConditions.temperature);
      const windSpeeds = successfulTrips.map(trip => trip.weatherConditions.windSpeed);
      const visibilities = successfulTrips.map(trip => trip.weatherConditions.visibility);

      return {
        optimalConditions: {
          temperature: {
            min: Math.min(...temperatures),
            max: Math.max(...temperatures),
          },
          windSpeed: {
            min: Math.min(...windSpeeds),
            max: Math.max(...windSpeeds),
          },
          visibility: {
            min: Math.min(...visibilities),
            max: Math.max(...visibilities),
          },
        },
        seasonalTrends: this.calculateSeasonalTrends(trips),
      };
    } catch (error: any) {
      console.error('Error calculating weather analytics:', error);
      if (error.code === 'permission-denied') {
        throw new Error('Access denied. Please ensure you are logged in and have proper permissions.');
      }
      throw new Error('Failed to calculate weather analytics');
    }
  }

  private async updateUserAnalytics(userId: string): Promise<void> {
    try {
      const analytics = await this.getFishingAnalytics(userId);
      const analyticsRef = doc(db, this.ANALYTICS_COLLECTION, userId);
      
      await updateDoc(analyticsRef, {
        ...analytics,
        lastUpdated: serverTimestamp(),
      }).catch(async () => {
        // If document doesn't exist, create it
        await addDoc(collection(db, this.ANALYTICS_COLLECTION), {
          userId,
          ...analytics,
          lastUpdated: serverTimestamp(),
        });
      });
    } catch (error) {
      console.error('Error updating user analytics:', error);
    }
  }

  private calculateSpeciesFrequency(trips: FishingDataEntry[]): { [species: string]: number } {
    const frequency: { [species: string]: number } = {};
    
    trips.forEach(trip => {
      trip.species.forEach(species => {
        frequency[species] = (frequency[species] || 0) + trip.catch.count;
      });
    });

    return frequency;
  }

  private calculateLocationFrequency(trips: FishingDataEntry[]): { [location: string]: number } {
    const frequency: { [location: string]: number } = {};
    
    trips.forEach(trip => {
      const location = trip.location.name;
      frequency[location] = (frequency[location] || 0) + 1;
    });

    return frequency;
  }

  private calculateMonthlyStats(trips: FishingDataEntry[]): { [month: string]: { trips: number; catch: number; success: number } } {
    const monthlyStats: { [month: string]: { trips: number; catch: number; success: number } } = {};
    
    trips.forEach(trip => {
      const month = new Date(trip.date).toLocaleDateString('en', { month: 'long', year: 'numeric' });
      
      if (!monthlyStats[month]) {
        monthlyStats[month] = { trips: 0, catch: 0, success: 0 };
      }
      
      monthlyStats[month].trips++;
      monthlyStats[month].catch += trip.catch.count;
      if (trip.success) monthlyStats[month].success++;
    });

    return monthlyStats;
  }

  private calculateEquipmentPerformance(trips: FishingDataEntry[]): { [equipment: string]: number } {
    const equipmentSuccess: { [equipment: string]: { total: number; successful: number } } = {};
    
    trips.forEach(trip => {
      trip.equipment.forEach(equipment => {
        if (!equipmentSuccess[equipment]) {
          equipmentSuccess[equipment] = { total: 0, successful: 0 };
        }
        equipmentSuccess[equipment].total++;
        if (trip.success) equipmentSuccess[equipment].successful++;
      });
    });

    const performanceRates: { [equipment: string]: number } = {};
    Object.entries(equipmentSuccess).forEach(([equipment, stats]) => {
      performanceRates[equipment] = stats.total > 0 ? stats.successful / stats.total : 0;
    });

    return performanceRates;
  }

  private calculateSeasonalTrends(trips: FishingDataEntry[]): { [season: string]: { successRate: number; avgCatch: number } } {
    const seasonalData: { [season: string]: { trips: FishingDataEntry[]; } } = {
      'Spring': { trips: [] },
      'Summer': { trips: [] },
      'Autumn': { trips: [] },
      'Winter': { trips: [] },
    };

    trips.forEach(trip => {
      const month = new Date(trip.date).getMonth();
      let season: string;
      
      if (month >= 2 && month <= 4) season = 'Spring';
      else if (month >= 5 && month <= 7) season = 'Summer';
      else if (month >= 8 && month <= 10) season = 'Autumn';
      else season = 'Winter';
      
      seasonalData[season].trips.push(trip);
    });

    const trends: { [season: string]: { successRate: number; avgCatch: number } } = {};
    
    Object.entries(seasonalData).forEach(([season, data]) => {
      const trips = data.trips;
      if (trips.length > 0) {
        trends[season] = {
          successRate: trips.filter(trip => trip.success).length / trips.length,
          avgCatch: trips.reduce((sum, trip) => sum + trip.catch.count, 0) / trips.length,
        };
      } else {
        trends[season] = { successRate: 0, avgCatch: 0 };
      }
    });

    return trends;
  }

  // Bulk operations for data migration or large imports
  async importFishingData(userId: string, trips: Omit<FishingTrip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[]): Promise<string[]> {
    try {
      const batch = [];
      const tripIds: string[] = [];

      for (const tripData of trips) {
        const trip: FishingTrip = {
          ...tripData,
          userId,
          createdAt: serverTimestamp() as Timestamp,
          updatedAt: serverTimestamp() as Timestamp,
        };

        const docRef = await addDoc(collection(db, this.COLLECTION_NAME), trip);
        tripIds.push(docRef.id);
      }

      // Update analytics after bulk import
      await this.updateUserAnalytics(userId);

      return tripIds;
    } catch (error) {
      console.error('Error importing fishing data:', error);
      throw new Error('Failed to import fishing data');
    }
  }
}

export const fishingDataService = new FishingDataService();
