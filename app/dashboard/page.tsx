"use client";

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useNetworkStatus } from '@/hooks/use-offline';
import { useFishingLogs } from '@/hooks/use-fishing-logs';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import WeatherCard from '@/components/WeatherCard';
import FishingAnalyticsCard from '@/components/FishingAnalyticsCard';
import { Card, CardContent } from '@/components/ui/card';

export default function Dashboard() {
  const { user } = useAuth();
  const { online: isOnline } = useNetworkStatus();
  const { syncStatus } = useFishingLogs();
  const [networkStatus] = useState({ online: isOnline });

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-custom-white dark:bg-black">
        <main className="container mx-auto px-4 py-6">
          
          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-medium text-foreground dark:text-custom-white mb-2 font-claude">
              Welcome back, {user?.email?.split('@')[0] || 'Fisher'}
            </h1>
            <p className="text-muted-foreground dark:text-custom-secondary text-base font-claude">
              Your personalized fishing dashboard with current conditions and analytics.
            </p>
            <div className="flex justify-center items-center gap-3 mt-4">
              <Badge variant={networkStatus.online ? "default" : "destructive"} className="gap-2 px-3 py-1 rounded-full bg-custom-primary/10 text-custom-primary border-custom-primary/20">
                <div className={`w-2 h-2 rounded-full ${networkStatus.online ? 'bg-custom-primary' : 'bg-custom-primary'}`}></div>
                {networkStatus.online ? "Online" : "Offline"}
              </Badge>
              <Badge variant="outline" className="gap-2 px-3 py-1 rounded-full border-custom-secondary/30 text-custom-secondary">
                {syncStatus === 'syncing' ? "🔄 Syncing..." : isOnline ? "☁️ Synced" : "💾 Saved Locally"}
              </Badge>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            
            {/* Weather Card */}
            <div>
              <ErrorBoundary fallback={
                <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
                  <CardContent className="p-4">
                    <p className="text-custom-primary font-claude">Could not load Weather Card.</p>
                  </CardContent>
                </Card>
              }>
                <WeatherCard />
              </ErrorBoundary>
            </div>

            {/* Fishing Analytics */}
            <div>
              <ErrorBoundary fallback={
                <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
                  <CardContent className="p-4">
                    <p className="text-custom-primary font-claude">Could not load Fishing Analytics.</p>
                  </CardContent>
                </Card>
              }>
                <FishingAnalyticsCard />
              </ErrorBoundary>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
