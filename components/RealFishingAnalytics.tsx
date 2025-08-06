'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Fish, MapPin, Calendar, TrendingUp, BarChart3, Award, Clock, Target } from 'lucide-react';
import { useSimpleFishingLogs } from '@/hooks/use-simple-fishing-logs';

export function RealFishingAnalytics() {
  const { analytics } = useSimpleFishingLogs();

  if (analytics.totalTrips === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Data Yet</h3>
          <p className="text-gray-500">Start logging your fishing trips in the Simple Log tab to see detailed analytics!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Fish className="w-8 h-8 mx-auto text-blue-600 mb-2" />
            <div className="text-2xl font-bold">{analytics.totalCatch}</div>
            <div className="text-sm text-gray-500">Total Fish Caught</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <div className="text-2xl font-bold">{analytics.successRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-500">Success Rate</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto text-orange-600 mb-2" />
            <div className="text-2xl font-bold">{analytics.averageDuration.toFixed(1)}h</div>
            <div className="text-sm text-gray-500">Avg Duration</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 mx-auto text-purple-600 mb-2" />
            <div className="text-2xl font-bold">{analytics.totalWeight.toFixed(1)} lbs</div>
            <div className="text-sm text-gray-500">Total Weight</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Species */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fish className="w-5 h-5" />
              Top Species Caught
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topSpecies.length === 0 ? (
              <p className="text-gray-500">No species data yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.topSpecies.map((item, index) => (
                  <div key={item.species} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="font-medium">{item.species}</span>
                    </div>
                    <Badge variant="outline">{item.count} caught</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Locations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Favorite Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.topLocations.length === 0 ? (
              <p className="text-gray-500">No location data yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.topLocations.map((item, index) => (
                  <div key={item.location} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className="font-medium">{item.location}</span>
                    </div>
                    <Badge variant="outline">{item.visits} visits</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Monthly Trends (Last 6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.monthlyTrends.map((month) => (
                <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{month.month}</div>
                    <div className="text-sm text-gray-500">
                      {month.trips} trips • {month.catches} fish
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      {month.successRate.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">success</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Day of Week Performance */}
        {analytics.dayOfWeekStats.length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Best Days to Fish
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {analytics.dayOfWeekStats.slice(0, 4).map((day) => (
                  <div key={day.day} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium text-sm">{day.day}</div>
                    <div className="text-lg font-bold text-blue-600">{day.successRate.toFixed(0)}%</div>
                    <div className="text-xs text-gray-500">
                      {day.trips} trips • {day.catches} fish
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {analytics.totalTrips}
              </div>
              <div className="text-sm text-blue-700">Total Fishing Trips</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {analytics.successfulTrips}
              </div>
              <div className="text-sm text-green-700">Successful Trips</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {(analytics.totalCatch / Math.max(analytics.totalTrips, 1)).toFixed(1)}
              </div>
              <div className="text-sm text-orange-700">Avg Fish per Trip</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
