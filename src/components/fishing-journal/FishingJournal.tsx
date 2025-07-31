'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Fish, TrendingUp, Camera, Mic, Search, Filter, Clock, Thermometer, Wind, Eye, Waves, Target, CalendarDays, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FishingTrip as FishingTripType, FishingAnalytics } from '@/types/fishing-journal';
import { fishingDataService, FishingTrip } from '@/services/fishingData';
import { FishingTripEntry } from '@/components/FishingTripEntry';
import { TripForm } from './TripForm';
import { TripAnalytics } from './TripAnalytics';
import { VoiceControls } from '../VoiceControls';

export function FishingJournal() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [trips, setTrips] = useState<FishingTrip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<FishingTrip[]>([]);
  const [analytics, setAnalytics] = useState<FishingAnalytics | null>(null);
  const [showTripForm, setShowTripForm] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<FishingTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'success' | 'catches'>('date');

  useEffect(() => {
    loadTrips();
  }, [user]);

  useEffect(() => {
    filterAndSortTrips();
  }, [trips, searchTerm, filterSpecies, filterLocation, sortBy]);

  const loadTrips = async () => {
    if (!user?.uid) return;
    
    setIsLoading(true);
    try {
      const userTrips = await fishingDataService.getUserFishingTrips(user.uid);
      setTrips(userTrips);
      calculateAnalytics(userTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load fishing trips.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortTrips = () => {
    let filtered = [...trips];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(trip =>
        trip.location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.species.some(species => species.toLowerCase().includes(searchTerm.toLowerCase())) ||
        trip.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Species filter
    if (filterSpecies !== 'all') {
      filtered = filtered.filter(trip => trip.species.includes(filterSpecies));
    }

    // Location filter
    if (filterLocation !== 'all') {
      filtered = filtered.filter(trip => trip.location.name === filterLocation);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'success':
          return (b.success ? 1 : 0) - (a.success ? 1 : 0);
        case 'catches':
          return b.catch.count - a.catch.count;
        default:
          return 0;
      }
    });

    setFilteredTrips(filtered);
  };

  const calculateAnalytics = (tripsData: FishingTrip[]) => {
    if (tripsData.length === 0) {
      setAnalytics(null);
      return;
    }

    const totalCatches = tripsData.reduce((sum, trip) => sum + trip.catch.count, 0);
    const totalWeight = tripsData.reduce((sum, trip) => sum + trip.catch.totalWeight, 0);
    const successfulTrips = tripsData.filter(trip => trip.success).length;
    const allSpecies = Array.from(new Set(tripsData.flatMap(trip => trip.species)));

    // Calculate location stats
    const locationStats = tripsData.reduce((acc, trip) => {
      const locationKey = trip.location.name;
      if (!acc[locationKey]) {
        acc[locationKey] = {
          name: trip.location.name,
          coordinates: trip.location,
          visitCount: 0,
          totalCatches: 0,
          successRate: 0,
        };
      }
      acc[locationKey].visitCount++;
      acc[locationKey].totalCatches += trip.catch.count;
      return acc;
    }, {} as Record<string, any>);

    // Calculate success rates for locations
    Object.keys(locationStats).forEach(locationKey => {
      const locationTrips = tripsData.filter(trip => trip.location.name === locationKey);
      const successfulLocationTrips = locationTrips.filter(trip => trip.success).length;
      locationStats[locationKey].successRate = (successfulLocationTrips / locationTrips.length) * 100;
    });

    const bestLocations = Object.values(locationStats)
      .sort((a: any, b: any) => b.successRate - a.successRate)
      .slice(0, 5);

    // Species analytics
    const speciesStats = tripsData.reduce((acc, trip) => {
      trip.species.forEach(species => {
        if (!acc[species]) {
          acc[species] = { count: 0, totalWeight: 0 };
        }
        acc[species].count += trip.catch.count;
        acc[species].totalWeight += trip.catch.totalWeight;
      });
      return acc;
    }, {} as Record<string, { count: number; totalWeight: number }>);

    const analytics: FishingAnalytics = {
      totalTrips: tripsData.length,
      totalCatches,
      totalSpecies: allSpecies.length,
      successRate: (successfulTrips / tripsData.length) * 100,
      averageCatchPerTrip: totalCatches / tripsData.length,
      bestLocations,
      topSpecies: Object.entries(speciesStats)
        .sort(([,a], [,b]) => b.count - a.count)
        .slice(0, 5)
        .map(([species, stats]) => ({
          species,
          count: stats.count,
          totalWeight: stats.totalWeight,
        })),
      monthlyTrends: [], // Calculate if needed
      timeSpentFishing: tripsData.reduce((sum, trip) => sum + trip.duration, 0),
      totalWeight,
    };

    setAnalytics(analytics);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getUniqueSpecies = () => {
    const species = Array.from(new Set(trips.flatMap(trip => trip.species)));
    return species.sort();
  };

  const getUniqueLocations = () => {
    const locations = Array.from(new Set(trips.map(trip => trip.location.name)));
    return locations.sort();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-custom-primary" />
      </div>
    );
  }
      loc.visitCount++;
      loc.totalCatches += trip.catches.reduce((sum, c) => sum + c.quantity, 0);
      loc.totalSuccess += trip.successScore;
    });

    const favoriteLocations = Array.from(locationMap.values())
      .map(loc => ({
        ...loc,
        averageSuccess: loc.totalSuccess / loc.visitCount,
        bestSeason: 'Summer' // Simplified for now
      }))
      .sort((a, b) => b.visitCount - a.visitCount)
      .slice(0, 5);

    const monthlyStats = calculateMonthlyStats(tripsData);

    setAnalytics({
      totalTrips: tripsData.length,
      totalCatches,
      totalSpecies: allSpecies.size,
      averageSuccessScore,
      favoriteLocations,
      bestTechniques: [], // Will implement detailed technique tracking
      seasonalPatterns: [], // Will implement seasonal analysis
      monthlyStats,
      speciesStats: [], // Will implement species tracking
      improvements: generateImprovements(tripsData),
    });
  };

  const calculateMonthlyStats = (tripsData: FishingTrip[]) => {
    const monthMap = new Map();
    
    tripsData.forEach(trip => {
      const date = new Date(trip.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'long' });
      
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, {
          month: monthName,
          year: date.getFullYear(),
          trips: 0,
          catches: 0,
          successScore: 0,
          topSpecies: new Set(),
        });
      }
      
      const monthData = monthMap.get(monthKey);
      monthData.trips++;
      monthData.catches += trip.catches.reduce((sum, c) => sum + c.quantity, 0);
      monthData.successScore += trip.successScore;
      trip.catches.forEach(c => monthData.topSpecies.add(c.species));
    });

    return Array.from(monthMap.values())
      .map(month => ({
        ...month,
        successScore: month.successScore / month.trips,
        topSpecies: Array.from(month.topSpecies).slice(0, 3),
      }))
      .sort((a, b) => new Date(`${b.year}-${b.month}`).getTime() - new Date(`${a.year}-${a.month}`).getTime());
  };

  const generateImprovements = (tripsData: FishingTrip[]): string[] => {
    const improvements = [];
    
    if (tripsData.length > 5) {
      const recentTrips = tripsData.slice(-5);
      const recentAvg = recentTrips.reduce((sum, trip) => sum + trip.successScore, 0) / recentTrips.length;
      const overallAvg = tripsData.reduce((sum, trip) => sum + trip.successScore, 0) / tripsData.length;
      
      if (recentAvg < overallAvg) {
        improvements.push("Recent trip success is below your average - try revisiting your most successful locations");
      }
    }

    improvements.push("Track water temperature for better pattern analysis");
    improvements.push("Document moon phases to identify lunar fishing patterns");
    
    return improvements;
  };

  const handleVoiceInput = (transcript: string) => {
    // Process voice commands for quick trip logging
    const lowerTranscript = transcript.toLowerCase();
    
    if (lowerTranscript.includes('new trip') || lowerTranscript.includes('log trip')) {
      setShowTripForm(true);
    } else if (lowerTranscript.includes('show stats') || lowerTranscript.includes('analytics')) {
      // Already on analytics tab - could highlight it
      console.log('Voice command: Show analytics');
    }
    
    // Could add more voice commands here
  };

  if (isLoading) {
    return (
      <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-primary mx-auto mb-4"></div>
          <p className="font-claude text-gray-800 dark:text-gray-200">Loading your fishing journal...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-claude text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Fishing Journal
            </CardTitle>
            <Button onClick={() => setShowTripForm(true)} className="bg-custom-primary hover:bg-red-700 text-white font-claude">
              New Trip
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Voice Controls */}
          <VoiceControls onTranscript={handleVoiceInput} />
        </CardContent>
      </Card>

      <Tabs defaultValue="trips" className="space-y-6">
        <TabsList className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
          <TabsTrigger value="trips" className="font-claude text-gray-800 dark:text-gray-200">
            My Trips ({trips.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="font-claude text-gray-800 dark:text-gray-200">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trips" className="space-y-4">
          {trips.length === 0 ? (
            <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2 font-claude text-gray-800 dark:text-gray-200">No trips logged yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 font-claude">
                  Start building your fishing journal by logging your first trip!
                </p>
                <Button onClick={() => setShowTripForm(true)} className="bg-custom-primary hover:bg-red-700 text-white font-claude">
                  Log Your First Trip
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map((trip) => (
                <Card key={trip.id} className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => setSelectedTrip(trip)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="font-claude border-custom-secondary text-gray-800 dark:text-gray-200">
                        {new Date(trip.date).toLocaleDateString()}
                      </Badge>
                      <Badge variant={trip.successScore >= 7 ? "default" : trip.successScore >= 4 ? "secondary" : "destructive"} className="font-claude">
                        {trip.successScore}/10
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-claude text-gray-800 dark:text-gray-200">
                      {trip.location.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-claude text-gray-600 dark:text-gray-400">
                        <span>{trip.catches.reduce((sum, c) => sum + c.quantity, 0)} catches</span>
                      </div>
                      <div className="text-sm font-claude text-gray-600 dark:text-gray-400">
                        <span>{Math.round(trip.duration / 60)} hours</span>
                      </div>
                      {trip.photos.length > 0 && (
                        <div className="text-sm font-claude text-gray-600 dark:text-gray-400">
                          <span>{trip.photos.length} photos</span>
                        </div>
                      )}
                      {trip.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate font-claude">
                          {trip.notes}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics">
          {analytics ? (
            <TripAnalytics analytics={analytics} />
          ) : (
            <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2 font-claude text-gray-800 dark:text-gray-200">No data yet</h3>
                <p className="text-gray-600 dark:text-gray-400 font-claude">
                  Log a few trips to see your fishing analytics and insights.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Trip Form Modal */}
      {showTripForm && (
        <TripForm
          onSave={saveTrip}
          onClose={() => setShowTripForm(false)}
        />
      )}

      {/* Trip Detail Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="font-claude text-gray-800 dark:text-gray-200">Trip Details</CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute top-4 right-4 font-claude text-gray-800 dark:text-gray-200"
                onClick={() => setSelectedTrip(null)}
              >
                ×
              </Button>
            </CardHeader>
            <CardContent>
              {/* Trip details would go here */}
              <p className="font-claude text-gray-600 dark:text-gray-400">Detailed trip view coming soon...</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
