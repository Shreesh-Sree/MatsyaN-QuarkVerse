'use client';

import { useState, useEffect } from 'react';
import { Plus, Calendar, MapPin, Fish, TrendingUp, Camera, Mic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { FishingTrip, FishingAnalytics } from '@/types/fishing-journal';
import { TripForm } from './TripForm';
import { TripAnalytics } from './TripAnalytics';
import { VoiceControls } from '../VoiceControls';

export function FishingJournal() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [trips, setTrips] = useState<FishingTrip[]>([]);
  const [analytics, setAnalytics] = useState<FishingAnalytics | null>(null);
  const [showTripForm, setShowTripForm] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<FishingTrip | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, [user]);

  const loadTrips = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load from localStorage for now (will be replaced with Firebase)
      const savedTrips = localStorage.getItem(`fishing-trips-${user.uid}`);
      const tripsData = savedTrips ? JSON.parse(savedTrips) : [];
      setTrips(tripsData);
      calculateAnalytics(tripsData);
    } catch (error) {
      console.error('Error loading trips:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTrip = (trip: Omit<FishingTrip, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const newTrip: FishingTrip = {
      ...trip,
      id: Date.now().toString(),
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    localStorage.setItem(`fishing-trips-${user.uid}`, JSON.stringify(updatedTrips));
    calculateAnalytics(updatedTrips);
    setShowTripForm(false);
  };

  const calculateAnalytics = (tripsData: FishingTrip[]) => {
    if (tripsData.length === 0) {
      setAnalytics(null);
      return;
    }

    const totalCatches = tripsData.reduce((sum, trip) => 
      sum + trip.catches.reduce((catchSum, catch_) => catchSum + catch_.quantity, 0), 0
    );

    const allSpecies = new Set(
      tripsData.flatMap(trip => trip.catches.map(c => c.species))
    );

    const averageSuccessScore = tripsData.reduce((sum, trip) => 
      sum + trip.successScore, 0
    ) / tripsData.length;

    // Calculate location stats
    const locationMap = new Map();
    tripsData.forEach(trip => {
      const locKey = `${trip.location.coordinates.lat},${trip.location.coordinates.lng}`;
      if (!locationMap.has(locKey)) {
        locationMap.set(locKey, {
          name: trip.location.name,
          coordinates: trip.location.coordinates,
          visitCount: 0,
          totalCatches: 0,
          totalSuccess: 0,
        });
      }
      const loc = locationMap.get(locKey);
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
