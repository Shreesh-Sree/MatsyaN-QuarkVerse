'use client';

import { TrendingUp, MapPin, Trophy, Target, Calendar, Fish, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FishingAnalytics } from '@/types/fishing-journal';

interface TripAnalyticsProps {
  analytics: FishingAnalytics;
}

export function TripAnalytics({ analytics }: TripAnalyticsProps) {
  const getSuccessColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSuccessLevel = (score: number) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Good';
    if (score >= 4) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-claude">Total Trips</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 font-claude">{analytics.totalTrips}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-claude">Total Catches</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 font-claude">{analytics.totalCatches}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-claude">Species Caught</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 font-claude">{analytics.totalSpecies}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-claude">Average Success</p>
                <p className={`text-2xl font-bold font-claude ${getSuccessColor(analytics.averageSuccessScore)}`}>
                  {analytics.averageSuccessScore.toFixed(1)}/10
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-claude">
                  {getSuccessLevel(analytics.averageSuccessScore)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Favorite Locations */}
      <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="font-claude text-gray-800 dark:text-gray-200">
            Top Fishing Spots
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.favoriteLocations.length > 0 ? (
            <div className="space-y-4">
              {analytics.favoriteLocations.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-custom-light/50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold font-claude text-gray-800 dark:text-gray-200">{location.name}</h4>
                    <div className="flex items-center gap-4 mt-1">
                      <Badge variant="outline" className="font-claude border-custom-secondary text-gray-800 dark:text-gray-200">
                        {location.visitCount} visit{location.visitCount !== 1 ? 's' : ''}
                      </Badge>
                      <Badge variant="outline">
                        {location.totalCatches} catches
                      </Badge>
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-claude">
                        Best: {location.bestSeason}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold font-claude ${getSuccessColor(location.averageSuccess)}`}>
                      {location.averageSuccess.toFixed(1)}/10
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-claude">
                      {getSuccessLevel(location.averageSuccess)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8 font-claude">
              No location data available yet. Log more trips to see your favorite spots!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Monthly Performance */}
      <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="font-claude text-gray-800 dark:text-gray-200">
            Monthly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.monthlyStats.length > 0 ? (
            <div className="space-y-4">
              {analytics.monthlyStats.slice(0, 6).map((month, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium font-claude text-gray-800 dark:text-gray-200">
                      {month.month} {month.year}
                    </span>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="font-claude border-custom-secondary text-gray-800 dark:text-gray-200">
                        {month.trips} trips
                      </Badge>
                      <Badge variant="outline" className="font-claude border-custom-secondary text-gray-800 dark:text-gray-200">
                        {month.catches} catches
                      </Badge>
                      <span className={`font-semibold font-claude ${getSuccessColor(month.successScore)}`}>
                        {month.successScore.toFixed(1)}/10
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={(month.successScore / 10) * 100} 
                    className="h-2"
                  />
                  {month.topSpecies.length > 0 && (
                    <div className="flex gap-1">
                      {month.topSpecies.map((species, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-claude border-custom-secondary text-gray-800 dark:text-gray-200">
                          {species}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8 font-claude">
              Not enough data for monthly analysis. Keep logging your trips!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Improvement Suggestions */}
      {analytics.improvements.length > 0 && (
        <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="font-claude text-gray-800 dark:text-gray-200">
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.improvements.map((improvement, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-custom-light/50 dark:bg-gray-800 rounded-lg">
                  <div className="w-2 h-2 bg-custom-primary rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm font-claude text-gray-800 dark:text-gray-200">{improvement}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Catch Rate Trends */}
      <Card className="border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="font-claude text-gray-800 dark:text-gray-200">
            Fishing Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 font-claude text-gray-800 dark:text-gray-200">Success Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-claude text-gray-600 dark:text-gray-400">Catches per trip:</span>
                  <Badge variant="outline" className="font-claude border-custom-secondary text-gray-800 dark:text-gray-200">
                    {(analytics.totalCatches / analytics.totalTrips).toFixed(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-claude text-gray-600 dark:text-gray-400">Species diversity:</span>
                  <Badge variant="outline" className="font-claude border-custom-secondary text-gray-800 dark:text-gray-200">
                    {((analytics.totalSpecies / analytics.totalCatches) * 100).toFixed(0)}%
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="font-claude text-gray-600 dark:text-gray-400">Location exploration:</span>
                  <Badge variant="outline" className="font-claude border-custom-secondary text-gray-800 dark:text-gray-200">
                    {analytics.favoriteLocations.length} spots
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3 font-claude text-gray-800 dark:text-gray-200">Recommendations</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-custom-primary rounded-full mt-2" />
                  <span className="font-claude text-gray-600 dark:text-gray-400">Try early morning or late evening for better results</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-custom-primary rounded-full mt-2" />
                  <span className="font-claude text-gray-600 dark:text-gray-400">Experiment with different baits and techniques</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-custom-primary rounded-full mt-2" />
                  <span className="font-claude text-gray-600 dark:text-gray-400">Keep detailed notes about successful patterns</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
