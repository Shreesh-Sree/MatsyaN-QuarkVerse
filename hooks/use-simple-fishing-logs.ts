'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export interface SimpleFishingEntry {
  id: string;
  date: string;
  location: string;
  species: string;
  quantity: number;
  weight: number;
  duration: number;
  success: boolean;
  notes: string;
  createdAt: Date;
}

export function useSimpleFishingLogs() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<SimpleFishingEntry[]>([]);

  // Load entries from localStorage
  useEffect(() => {
    if (user?.uid) {
      const savedEntries = localStorage.getItem(`fishing-entries-${user.uid}`);
      if (savedEntries) {
        const parsed = JSON.parse(savedEntries);
        setEntries(parsed);
      }
    }
  }, [user]);

  // Save entries to localStorage
  const saveEntries = (newEntries: SimpleFishingEntry[]) => {
    if (user?.uid) {
      localStorage.setItem(`fishing-entries-${user.uid}`, JSON.stringify(newEntries));
      setEntries(newEntries);
    }
  };

  const addEntry = (entry: Omit<SimpleFishingEntry, 'id' | 'createdAt'>) => {
    const newEntry: SimpleFishingEntry = {
      ...entry,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    const updatedEntries = [newEntry, ...entries];
    saveEntries(updatedEntries);
    return newEntry;
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    saveEntries(updatedEntries);
  };

  // Analytics calculations
  const analytics = {
    totalTrips: entries.length,
    successfulTrips: entries.filter(e => e.success).length,
    totalCatch: entries.reduce((sum, e) => sum + e.quantity, 0),
    totalWeight: entries.reduce((sum, e) => sum + e.weight, 0),
    averageDuration: entries.length > 0 ? entries.reduce((sum, e) => sum + e.duration, 0) / entries.length : 0,
    successRate: entries.length > 0 ? (entries.filter(e => e.success).length / entries.length) * 100 : 0,
    
    // Top species
    topSpecies: (() => {
      const speciesCount = entries.reduce((acc, entry) => {
        acc[entry.species] = (acc[entry.species] || 0) + entry.quantity;
        return acc;
      }, {} as Record<string, number>);
      
      return Object.entries(speciesCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([species, count]) => ({ species, count }));
    })(),
    
    // Top locations
    topLocations: (() => {
      const locationCount = entries.reduce((acc, entry) => {
        acc[entry.location] = (acc[entry.location] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return Object.entries(locationCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([location, visits]) => ({ location, visits }));
    })(),

    // Recent entries
    recentEntries: entries.slice(0, 5),

    // Monthly trends (last 6 months)
    monthlyTrends: (() => {
      const now = new Date();
      const months = [];
      
      for (let i = 5; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEntries = entries.filter(entry => {
          const entryDate = new Date(entry.date);
          return entryDate.getMonth() === month.getMonth() && 
                 entryDate.getFullYear() === month.getFullYear();
        });
        
        months.push({
          month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          trips: monthEntries.length,
          catches: monthEntries.reduce((sum, e) => sum + e.quantity, 0),
          successRate: monthEntries.length > 0 ? 
            (monthEntries.filter(e => e.success).length / monthEntries.length) * 100 : 0
        });
      }
      
      return months;
    })(),

    // Best performing days of week
    dayOfWeekStats: (() => {
      const dayStats = entries.reduce((acc, entry) => {
        const dayOfWeek = new Date(entry.date).getDay();
        const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
        
        if (!acc[dayName]) {
          acc[dayName] = { trips: 0, catches: 0, successfulTrips: 0 };
        }
        
        acc[dayName].trips++;
        acc[dayName].catches += entry.quantity;
        if (entry.success) acc[dayName].successfulTrips++;
        
        return acc;
      }, {} as Record<string, { trips: number; catches: number; successfulTrips: number }>);

      return Object.entries(dayStats)
        .map(([day, stats]) => ({
          day,
          ...stats,
          successRate: stats.trips > 0 ? (stats.successfulTrips / stats.trips) * 100 : 0
        }))
        .sort((a, b) => b.successRate - a.successRate);
    })()
  };

  return {
    entries,
    analytics,
    addEntry,
    deleteEntry,
    saveEntries
  };
}
