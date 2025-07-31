"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Fish, Map, Shield, Scale, Bot, Clock, Target, Zap, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNetworkStatus } from '@/hooks/use-offline';
import { useFishingLogs } from '@/hooks/use-fishing-logs';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import WeatherCard from '@/components/WeatherCard';
import FishingAnalyticsCard from '@/components/FishingAnalyticsCard';
import { FishingJournal } from '@/components/fishing-journal/FishingJournal';
import { FishingDataInfographics } from '@/components/FishingDataInfographics';
import GoogleVoiceAssistant from '@/components/GoogleVoiceAssistant';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();
  const { syncStatus } = useFishingLogs();
  const [networkStatus] = useState({ online: isOnline });

  const handleVoiceCommand = (transcript: string) => {
    console.log('Voice command received:', transcript);
    // Handle voice commands here
  };

  const quickActions = [
    { title: "Find Fishing Spots", href: "/map", color: "bg-custom-primary text-custom-white hover:bg-custom-primary/90" },
    { title: "Safety Guidelines", href: "/safety", color: "bg-custom-secondary text-custom-white hover:bg-custom-secondary/90" },
    { title: "Fishing Regulations", href: "/laws", color: "bg-custom-primary text-custom-white hover:bg-custom-primary/90" },
    { title: "AI Assistant", href: "/chat", color: "bg-custom-secondary text-custom-white hover:bg-custom-secondary/90" },
  ];

  const statsData = [
    { label: "Total Catches", value: "127", trend: "+12%" },
    { label: "Fishing Hours", value: "89", trend: "+8%" },
    { label: "Success Rate", value: "78%", trend: "+5%" },
    { label: "Active Streak", value: "15", trend: "+3" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-custom-primary" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-custom-secondary" />;
      case 'error': return <XCircle className="w-4 h-4 text-custom-primary" />;
      default: return <Activity className="w-4 h-4 text-custom-primary" />;
    }
  };

  const recentActivity = [
    { message: "Weather alert: Strong winds expected", status: "warning", time: "2 min ago" },
    { message: "Fishing log synced successfully", status: "success", time: "5 min ago" },
    { message: "New fishing spot discovered nearby", status: "success", time: "10 min ago" },
    { message: "Safety check completed", status: "success", time: "15 min ago" },
  ];

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
              Ready for another great day on the water? Here's your personalized dashboard.
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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsData.map((stat, index) => (
              <Card key={stat.label} className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900 hover:shadow-lg transition-all duration-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-custom-secondary dark:text-custom-secondary font-claude">
                      {stat.label}
                    </p>
                    <span className="text-xs text-custom-primary font-medium font-claude">
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-semibold text-foreground dark:text-custom-white font-claude">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Fishing Data Infographics */}
              <div>
                <ErrorBoundary fallback={
                  <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
                    <CardContent className="p-4">
                      <p className="text-custom-primary font-claude">Could not load Fishing Data Analytics.</p>
                    </CardContent>
                  </Card>
                }>
                  <FishingDataInfographics />
                </ErrorBoundary>
              </div>
              
              {/* Voice Assistant */}
              <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium text-foreground dark:text-custom-white font-claude">
                    Voice Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground dark:text-custom-secondary mb-4 text-sm font-claude">
                    Use voice commands to navigate. Try "show weather" or "open journal".
                  </p>
                  <ErrorBoundary fallback={<p className="text-custom-primary font-claude">Voice assistant is currently unavailable.</p>}>
                    <GoogleVoiceAssistant onTranscript={handleVoiceCommand} />
                  </ErrorBoundary>
                </CardContent>
              </Card>

              {/* Fishing Journal */}
              <div>
                <ErrorBoundary fallback={
                  <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
                    <CardContent className="p-4">
                      <p className="text-custom-primary font-claude">Could not load Fishing Journal.</p>
                    </CardContent>
                  </Card>
                }>
                  <FishingJournal />
                </ErrorBoundary>
              </div>

              {/* Recent Activity */}
              <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium text-foreground dark:text-custom-white font-claude">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-custom-light dark:bg-gray-800 rounded-lg border border-custom-secondary/10">
                        {getStatusIcon(activity.status)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground dark:text-custom-white font-claude">
                            {activity.message}
                          </p>
                          <p className="text-xs text-muted-foreground dark:text-custom-secondary font-claude">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              
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

              {/* Analytics */}
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

              {/* Quick Actions */}
              <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium text-foreground dark:text-custom-white font-claude">
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickActions.map((action) => (
                    <Link href={action.href} key={action.title} className="block">
                      <Button 
                        className={`w-full ${action.color} border-0 rounded-lg font-medium text-sm py-3 font-claude`}
                        variant="default"
                      >
                        {action.title}
                      </Button>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              {/* Weekly Progress */}
              <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium text-foreground dark:text-custom-white font-claude">
                    Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground dark:text-custom-white font-claude">Fishing Goals</span>
                      <span className="text-sm text-muted-foreground dark:text-custom-secondary font-claude">75%</span>
                    </div>
                    <Progress value={75} className="h-2 bg-custom-light dark:bg-gray-700" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground dark:text-custom-white font-claude">Safety Checks</span>
                      <span className="text-sm text-muted-foreground dark:text-custom-secondary font-claude">100%</span>
                    </div>
                    <Progress value={100} className="h-2 bg-custom-light dark:bg-gray-700" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-foreground dark:text-custom-white font-claude">Journal Entries</span>
                      <span className="text-sm text-muted-foreground dark:text-custom-secondary font-claude">60%</span>
                    </div>
                    <Progress value={60} className="h-2 bg-custom-light dark:bg-gray-700" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
