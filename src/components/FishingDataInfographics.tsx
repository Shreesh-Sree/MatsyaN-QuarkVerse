"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Fish, 
  MapPin, 
  TrendingUp, 
  Calendar, 
  Target,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Waves,
  Thermometer,
  Wind,
  Eye,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { fishingDataService, FishingAnalytics, WeatherAnalytics } from '@/services/fishingData';
import { geminiService } from '@/services/gemini';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface FishingInsights {
  insights: string;
  recommendations: string[];
  bestTimes: string[];
  optimalConditions: string;
}

export function FishingDataInfographics() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [analytics, setAnalytics] = useState<FishingAnalytics | null>(null);
  const [weatherAnalytics, setWeatherAnalytics] = useState<WeatherAnalytics | null>(null);
  const [insights, setInsights] = useState<FishingInsights | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadAnalytics();
    }
  }, [user?.uid]);

  const loadAnalytics = async () => {
    if (!user?.uid) return;
    
    try {
      setIsLoading(true);
      const [analyticsData, weatherData] = await Promise.all([
        fishingDataService.getFishingAnalytics(user.uid),
        fishingDataService.getWeatherAnalytics(user.uid)
      ]);
      
      setAnalytics(analyticsData);
      setWeatherAnalytics(weatherData);
    } catch (error) {
      console.error('Error loading analytics:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load fishing analytics'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsights = async () => {
    if (!user?.uid || !analytics) return;
    
    try {
      setIsGeneratingInsights(true);
      const fishingTrips = await fishingDataService.getFishingTrips(user.uid);
      const aiInsights = await geminiService.generateFishingInsights(fishingTrips);
      
      // Parse AI insights into structured format
      const parsedInsights: FishingInsights = {
        insights: aiInsights,
        recommendations: extractRecommendations(aiInsights),
        bestTimes: extractBestTimes(aiInsights),
        optimalConditions: extractOptimalConditions(aiInsights)
      };
      
      setInsights(parsedInsights);
      toast({
        title: 'Success',
        description: 'AI insights generated successfully!'
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate AI insights'
      });
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const extractRecommendations = (insights: string): string[] => {
    const lines = insights.split('\\n');
    return lines
      .filter(line => line.includes('recommend') || line.includes('should') || line.includes('try'))
      .slice(0, 3)
      .map(line => line.trim());
  };

  const extractBestTimes = (insights: string): string[] => {
    const lines = insights.split('\\n');
    return lines
      .filter(line => line.includes('time') || line.includes('hour') || line.includes('morning') || line.includes('evening'))
      .slice(0, 2)
      .map(line => line.trim());
  };

  const extractOptimalConditions = (insights: string): string => {
    const lines = insights.split('\\n');
    const conditionLine = lines.find(line => line.includes('condition') || line.includes('weather'));
    return conditionLine?.trim() || 'Optimal conditions vary by location and season.';
  };

  if (isLoading) {
    return (
      <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-custom-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground dark:text-custom-white font-claude">
            Fishing Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Fish className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-claude">No fishing data available yet.</p>
          <p className="text-sm text-muted-foreground mt-2 font-claude">
            Start logging your fishing trips to see detailed analytics!
          </p>
        </CardContent>
      </Card>
    );
  }

  const topSpecies = Object.entries(analytics.favoriteSpecies)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const topLocations = Object.entries(analytics.favoriteLocations)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-custom-secondary font-claude">Total Trips</p>
                <p className="text-2xl font-bold text-foreground dark:text-custom-white font-claude">
                  {analytics.totalTrips}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-custom-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-custom-secondary font-claude">Success Rate</p>
                <p className="text-2xl font-bold text-foreground dark:text-custom-white font-claude">
                  {(analytics.successRate * 100).toFixed(1)}%
                </p>
              </div>
              <Target className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-custom-secondary font-claude">Total Catch</p>
                <p className="text-2xl font-bold text-foreground dark:text-custom-white font-claude">
                  {analytics.totalCatch}
                </p>
              </div>
              <Fish className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-custom-secondary font-claude">Avg per Trip</p>
                <p className="text-2xl font-bold text-foreground dark:text-custom-white font-claude">
                  {analytics.averageCatchPerTrip.toFixed(1)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Species */}
        <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground dark:text-custom-white font-claude flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Favorite Species
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topSpecies.map(([species, count], index) => (
              <div key={species} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs font-claude">
                    #{index + 1}
                  </Badge>
                  <span className="font-medium text-foreground font-claude">{species}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-claude">{count} fish</span>
                  <Progress 
                    value={(count / Math.max(...Object.values(analytics.favoriteSpecies))) * 100} 
                    className="w-16 h-2"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground dark:text-custom-white font-claude flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Favorite Locations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topLocations.map(([location, visits], index) => (
              <div key={location} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs font-claude">
                    #{index + 1}
                  </Badge>
                  <span className="font-medium text-foreground font-claude">{location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-claude">{visits} visits</span>
                  <Progress 
                    value={(visits / Math.max(...Object.values(analytics.favoriteLocations))) * 100} 
                    className="w-16 h-2"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weather Analytics */}
        {weatherAnalytics && (
          <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground dark:text-custom-white font-claude flex items-center gap-2">
                <Waves className="w-5 h-5" />
                Optimal Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 bg-custom-light dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium font-claude">Temperature</span>
                  </div>
                  <span className="text-sm text-muted-foreground font-claude">
                    {weatherAnalytics.optimalConditions.temperature.min}°C - {weatherAnalytics.optimalConditions.temperature.max}°C
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-custom-light dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Wind className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium font-claude">Wind Speed</span>
                  </div>
                  <span className="text-sm text-muted-foreground font-claude">
                    {weatherAnalytics.optimalConditions.windSpeed.min} - {weatherAnalytics.optimalConditions.windSpeed.max} km/h
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-custom-light dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium font-claude">Visibility</span>
                  </div>
                  <span className="text-sm text-muted-foreground font-claude">
                    {weatherAnalytics.optimalConditions.visibility.min} - {weatherAnalytics.optimalConditions.visibility.max} km
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Insights */}
        <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground dark:text-custom-white font-claude flex items-center gap-2">
              <Activity className="w-5 h-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!insights ? (
              <div className="text-center py-4">
                <Button 
                  onClick={generateInsights}
                  disabled={isGeneratingInsights}
                  className="bg-custom-primary hover:bg-custom-primary/90 text-custom-white font-claude"
                >
                  {isGeneratingInsights ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Award className="w-4 h-4 mr-2" />
                      Generate AI Insights
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3 bg-custom-light dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium text-foreground mb-2 font-claude">Key Recommendations</h4>
                  <ul className="space-y-1">
                    {insights.recommendations.slice(0, 2).map((rec, index) => (
                      <li key={index} className="text-sm text-muted-foreground font-claude">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button 
                  onClick={generateInsights}
                  disabled={isGeneratingInsights}
                  variant="outline"
                  size="sm"
                  className="w-full font-claude"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Insights
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
