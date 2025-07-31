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

    if (searchTerm) {
      filtered = filtered.filter(trip =>
        trip.location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.species.some(species => species.toLowerCase().includes(searchTerm.toLowerCase())) ||
        trip.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSpecies !== 'all') {
      filtered = filtered.filter(trip => trip.species.includes(filterSpecies));
    }

    if (filterLocation !== 'all') {
      filtered = filtered.filter(trip => trip.location.name === filterLocation);
    }

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

    Object.keys(locationStats).forEach(locationKey => {
      const locationTrips = tripsData.filter(trip => trip.location.name === locationKey);
      const successfulLocationTrips = locationTrips.filter(trip => trip.success).length;
      locationStats[locationKey].successRate = (successfulLocationTrips / locationTrips.length) * 100;
    });

    const bestLocations = Object.values(locationStats)
      .sort((a: any, b: any) => b.successRate - a.successRate)
      .slice(0, 5);

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
      monthlyTrends: [],
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

  const handleVoiceInput = (transcript: string) => {
    const lowerTranscript = transcript.toLowerCase();
    
    if (lowerTranscript.includes('new trip') || lowerTranscript.includes('log trip')) {
      setShowTripForm(true);
    } else if (lowerTranscript.includes('show stats') || lowerTranscript.includes('analytics')) {
      console.log('Voice command: Show analytics');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-custom-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-claude text-2xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
              <Fish className="w-6 h-6 text-custom-primary" />
              Fishing Journal
            </CardTitle>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowTripForm(true)} 
                className="bg-custom-primary hover:bg-custom-primary/90 text-custom-white font-claude"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Trip
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <VoiceControls onTranscript={handleVoiceInput} />
        </CardContent>
      </Card>

      {showTripForm && (
        <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-claude text-xl text-gray-800 dark:text-gray-200">
                Log New Fishing Trip
              </CardTitle>
              <Button 
                variant="outline" 
                onClick={() => setShowTripForm(false)}
                className="font-claude"
              >
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <FishingTripEntry />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="trips" className="space-y-6">
        <TabsList className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
          <TabsTrigger value="trips" className="font-claude text-gray-800 dark:text-gray-200">
            <Fish className="w-4 h-4 mr-2" />
            My Trips ({trips.length})
          </TabsTrigger>
          <TabsTrigger value="analytics" className="font-claude text-gray-800 dark:text-gray-200">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trips" className="space-y-4">
          <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search trips..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-claude"
                  />
                </div>

                <Select value={filterSpecies} onValueChange={setFilterSpecies}>
                  <SelectTrigger className="font-claude">
                    <SelectValue placeholder="Filter by species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Species</SelectItem>
                    {getUniqueSpecies().map(species => (
                      <SelectItem key={species} value={species}>{species}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="font-claude">
                    <SelectValue placeholder="Filter by location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {getUniqueLocations().map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="font-claude">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="catches">Catches</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {filteredTrips.length === 0 ? (
            <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2 font-claude text-gray-800 dark:text-gray-200">
                  {trips.length === 0 ? 'No trips logged yet' : 'No trips match your filters'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 font-claude">
                  {trips.length === 0 
                    ? 'Start logging your fishing adventures to track your progress and discover patterns.'
                    : 'Try adjusting your search or filter criteria to find trips.'
                  }
                </p>
                {trips.length === 0 && (
                  <Button 
                    onClick={() => setShowTripForm(true)} 
                    className="bg-custom-primary hover:bg-custom-primary/90 text-custom-white font-claude"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Log Your First Trip
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredTrips.map((trip) => (
                <Card key={trip.id} className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${trip.success ? 'bg-green-500' : 'bg-red-500'}`} />
                        <div>
                          <h3 className="text-lg font-semibold font-claude text-gray-800 dark:text-gray-200">
                            {trip.location.name}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(trip.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {trip.duration}h
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {trip.location.lat.toFixed(4)}, {trip.location.lng.toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={trip.success ? "default" : "secondary"} className="font-claude">
                        {trip.success ? 'Successful' : 'Challenging'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Fish className="w-4 h-4 text-custom-primary" />
                        <span className="text-sm font-claude">
                          {trip.catch.count} fish ({trip.catch.totalWeight.toFixed(1)}kg)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-claude">
                          {trip.weatherConditions.temperature}°C
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wind className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-claude">
                          {trip.weatherConditions.windSpeed} km/h
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Waves className="w-4 h-4 text-teal-500" />
                        <span className="text-sm font-claude">
                          {trip.weatherConditions.waveHeight}m waves
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {trip.species.map((species, index) => (
                          <Badge key={index} variant="outline" className="font-claude">
                            {species}
                          </Badge>
                        ))}
                      </div>
                      {trip.equipment.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {trip.equipment.slice(0, 3).map((equipment, index) => (
                            <Badge key={index} variant="secondary" className="font-claude text-xs">
                              {equipment}
                            </Badge>
                          ))}
                          {trip.equipment.length > 3 && (
                            <Badge variant="secondary" className="font-claude text-xs">
                              +{trip.equipment.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    {trip.notes && (
                      <div className="border-t border-custom-secondary/20 pt-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-claude">
                          {trip.notes}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          {analytics ? (
            <TripAnalytics analytics={analytics} />
          ) : (
            <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2 font-claude text-gray-800 dark:text-gray-200">
                  No analytics available
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 font-claude">
                  Log some fishing trips to see your analytics and insights.
                </p>
                <Button 
                  onClick={() => setShowTripForm(true)} 
                  className="bg-custom-primary hover:bg-custom-primary/90 text-custom-white font-claude"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Log Your First Trip
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
