"use client";

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { 
  Fish, 
  Calendar, 
  TrendingUp, 
  Award, 
  MapPin, 
  Thermometer,
  Wind,
  Clock,
  Target,
  Activity,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { useFishingLogs, FishingLog } from '@/hooks/use-fishing-logs';
import { format, parseISO, getMonth, getWeek, startOfWeek, endOfWeek } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function FishingAnalytics() {
  const { logs, loading } = useFishingLogs();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    if (!logs.length) return null;

    // Total statistics
    const totalTrips = logs.length;
    const totalCatches = logs.reduce((sum, log) => 
      sum + log.catches.reduce((catchSum, c) => catchSum + c.quantity, 0), 0
    );
    const totalHours = logs.reduce((sum, log) => sum + (log.duration / 60), 0);
    const successRate = logs.filter(log => log.catches.length > 0).length / logs.length * 100;

    // Species analysis
    const speciesData = logs.reduce((acc, log) => {
      log.catches.forEach(c => {
        if (!acc[c.species]) {
          acc[c.species] = { name: c.species, count: 0, totalWeight: 0, avgSize: 0 };
        }
        acc[c.species].count += c.quantity;
        acc[c.species].totalWeight += c.weight || 0;
        acc[c.species].avgSize += c.size || 0;
      });
      return acc;
    }, {} as Record<string, any>);

    const topSpecies = Object.values(speciesData)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 5);

    // Location analysis
    const locationData = logs.reduce((acc, log) => {
      const location = log.location.name;
      if (!acc[location]) {
        acc[location] = { name: location, trips: 0, catches: 0, successRate: 0 };
      }
      acc[location].trips += 1;
      acc[location].catches += log.catches.reduce((sum, c) => sum + c.quantity, 0);
      return acc;
    }, {} as Record<string, any>);

    Object.values(locationData).forEach((loc: any) => {
      const successfulTrips = logs.filter(log => 
        log.location.name === loc.name && log.catches.length > 0
      ).length;
      loc.successRate = (successfulTrips / loc.trips) * 100;
    });

    const topLocations = Object.values(locationData)
      .sort((a: any, b: any) => b.catches - a.catches)
      .slice(0, 5);

    // Weather analysis
    const weatherData = logs.reduce((acc, log) => {
      const condition = log.weather.conditions;
      if (!acc[condition]) {
        acc[condition] = { condition, trips: 0, catches: 0, avgTemp: 0 };
      }
      acc[condition].trips += 1;
      acc[condition].catches += log.catches.reduce((sum, c) => sum + c.quantity, 0);
      acc[condition].avgTemp += log.weather.temperature;
      return acc;
    }, {} as Record<string, any>);

    Object.values(weatherData).forEach((weather: any) => {
      weather.avgTemp = weather.avgTemp / weather.trips;
      weather.catchesPerTrip = weather.catches / weather.trips;
    });

    // Time-based analysis
    const monthlyData = logs.reduce((acc, log) => {
      const month = format(new Date(log.createdAt), 'MMM yyyy');
      if (!acc[month]) {
        acc[month] = { month, trips: 0, catches: 0, hours: 0 };
      }
      acc[month].trips += 1;
      acc[month].catches += log.catches.reduce((sum, c) => sum + c.quantity, 0);
      acc[month].hours += log.duration / 60;
      return acc;
    }, {} as Record<string, any>);

    const monthlyTrends = Object.values(monthlyData).sort((a: any, b: any) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );

    // Bait effectiveness
    const baitData = logs.reduce((acc, log) => {
      log.bait.forEach(bait => {
        if (!acc[bait]) {
          acc[bait] = { bait, uses: 0, catches: 0, effectiveness: 0 };
        }
        acc[bait].uses += 1;
        acc[bait].catches += log.catches.reduce((sum, c) => sum + c.quantity, 0);
      });
      return acc;
    }, {} as Record<string, any>);

    Object.values(baitData).forEach((bait: any) => {
      bait.effectiveness = bait.catches / bait.uses;
    });

    const topBaits = Object.values(baitData)
      .sort((a: any, b: any) => b.effectiveness - a.effectiveness)
      .slice(0, 5);

    // Technique analysis
    const techniqueData = logs.reduce((acc, log) => {
      log.techniques.forEach(technique => {
        if (!acc[technique]) {
          acc[technique] = { technique, uses: 0, catches: 0, successRate: 0 };
        }
        acc[technique].uses += 1;
        acc[technique].catches += log.catches.reduce((sum, c) => sum + c.quantity, 0);
      });
      return acc;
    }, {} as Record<string, any>);

    Object.values(techniqueData).forEach((tech: any) => {
      tech.successRate = (tech.catches / tech.uses) * 100;
    });

    return {
      totalStats: { totalTrips, totalCatches, totalHours, successRate },
      topSpecies,
      topLocations,
      weatherData: Object.values(weatherData),
      monthlyTrends,
      topBaits,
      techniqueData: Object.values(techniqueData)
    };
  }, [logs]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-primary"></div>
            <span className="ml-2">Loading analytics...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Fish className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Fishing Data Yet</h3>
          <p className="text-muted-foreground">Start logging your fishing trips to see detailed analytics!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-custom-primary" />
              <span className="text-sm font-medium">Total Trips</span>
            </div>
            <div className="text-2xl font-bold">{analytics.totalStats.totalTrips}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Fish className="w-4 h-4 text-custom-primary" />
              <span className="text-sm font-medium">Total Catches</span>
            </div>
            <div className="text-2xl font-bold">{analytics.totalStats.totalCatches}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-custom-primary" />
              <span className="text-sm font-medium">Total Hours</span>
            </div>
            <div className="text-2xl font-bold">{analytics.totalStats.totalHours.toFixed(1)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-custom-primary" />
              <span className="text-sm font-medium">Success Rate</span>
            </div>
            <div className="text-2xl font-bold">{analytics.totalStats.successRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="species" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="species">Species</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="bait">Bait</TabsTrigger>
          <TabsTrigger value="techniques">Techniques</TabsTrigger>
        </TabsList>

        {/* Species Analysis */}
        <TabsContent value="species" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fish className="w-5 h-5" />
                Top Species Caught
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.topSpecies}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Analysis */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Best Fishing Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.topLocations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="catches" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Weather Analysis */}
        <TabsContent value="weather" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="w-5 h-5" />
                Weather vs Catches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.weatherData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="condition" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="catchesPerTrip" fill="#FFBB28" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Monthly Fishing Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="catches" stroke="#0088FE" strokeWidth={2} />
                  <Line type="monotone" dataKey="trips" stroke="#00C49F" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bait Effectiveness */}
        <TabsContent value="bait" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Most Effective Baits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.topBaits}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="bait" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="effectiveness" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Techniques */}
        <TabsContent value="techniques" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Technique Success Rates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={analytics.techniqueData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="technique" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar 
                    name="Success Rate" 
                    dataKey="successRate" 
                    stroke="#8884D8" 
                    fill="#8884D8" 
                    fillOpacity={0.6} 
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
