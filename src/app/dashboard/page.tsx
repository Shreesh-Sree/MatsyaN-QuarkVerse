"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Fish, Map, Shield, Scale, Bot, Sun, Wind, Droplets, BarChart3, TrendingUp, Calendar, Clock, Target, Zap, Users, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useFishingLogs } from '@/hooks/useFishingLogs';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import WeatherCard from '@/components/WeatherCard';
import FishingAnalyticsCard from '@/components/FishingAnalyticsCard';
import FishingJournal from '@/components/FishingJournal';
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
    { title: "Find Fishing Spots", href: "/map", icon: Map, color: "text-custom-primary", bgColor: "bg-custom-primary/10" },
    { title: "Safety Guidelines", href: "/safety", icon: Shield, color: "text-custom-secondary", bgColor: "bg-custom-secondary/10" },
    { title: "Fishing Regulations", href: "/laws", icon: Scale, color: "text-custom-primary", bgColor: "bg-custom-primary/10" },
    { title: "AI Assistant", href: "/chat", icon: Bot, color: "text-custom-secondary", bgColor: "bg-custom-secondary/10" },
  ];

  const statsData = [
    { label: "Total Catches", value: "127", icon: Fish, color: "text-custom-primary", bgColor: "bg-custom-primary/10", trend: "+12%" },
    { label: "Fishing Hours", value: "89", icon: Clock, color: "text-custom-secondary", bgColor: "bg-custom-secondary/10", trend: "+8%" },
    { label: "Success Rate", value: "78%", icon: Target, color: "text-custom-primary", bgColor: "bg-custom-primary/10", trend: "+5%" },
    { label: "Active Streak", value: "15", icon: Zap, color: "text-custom-secondary", bgColor: "bg-custom-secondary/10", trend: "+3" },
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
      <div className="min-h-screen w-full bg-background text-foreground">
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
                Welcome back, {user?.email?.split('@')[0] || 'Fisher'}!
              </h1>
              <p className="text-muted-foreground text-lg">
                Ready for another great day on the water? Here's your personalized dashboard.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={networkStatus.online ? "default" : "destructive"} className="gap-2 px-4 py-2 rounded-full">
                <div className={`w-2 h-2 rounded-full ${networkStatus.online ? 'bg-custom-primary' : 'bg-custom-primary'}`}></div>
                {networkStatus.online ? "Online" : "Offline"}
              </Badge>
              <Badge variant="outline" className="gap-2 px-4 py-2 rounded-full">
                {syncStatus === 'syncing' ? "🔄 Syncing..." : isOnline ? "☁️ Synced" : "💾 Saved Locally"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsData.map((stat, index) => (
              <Card key={stat.label} className="dashboard-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground font-medium">{stat.trend}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="dashboard-stat">{stat.value}</p>
                    <p className="dashboard-label">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            <div className="lg:col-span-2 space-y-8">
              <Card className="modern-card hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                    <div className="w-10 h-10 rounded-xl bg-custom-secondary/10 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-custom-secondary" />
                    </div>
                    Voice Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">
                    Use voice commands to navigate. Try "show weather" or "open journal".
                  </p>
                  <ErrorBoundary fallback={<p className="text-destructive">Voice assistant is currently unavailable.</p>}>
                    <GoogleVoiceAssistant onTranscript={handleVoiceCommand} />
                  </ErrorBoundary>
                </CardContent>
              </Card>

              <div data-section="journal">
                <ErrorBoundary fallback={<Card className="modern-card"><CardContent><p>Could not load Fishing Journal.</p></CardContent></Card>}>
                  <FishingJournal />
                </ErrorBoundary>
              </div>

              <Card className="modern-card hover-lift">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                    <div className="w-10 h-10 rounded-xl bg-custom-primary/10 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-custom-primary" />
                    </div>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 bg-custom-light dark:bg-gray-800 rounded-xl">
                        {getStatusIcon(activity.status)}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div data-section="weather">
                <ErrorBoundary fallback={<Card className="modern-card"><CardContent><p>Could not load Weather Card.</p></CardContent></Card>}>
                  <WeatherCard />
                </ErrorBoundary>
              </div>

              <div data-section="analytics">
                <ErrorBoundary fallback={<Card className="modern-card"><CardContent><p>Could not load Fishing Analytics.</p></CardContent></Card>}>
                  <FishingAnalyticsCard />
                </ErrorBoundary>
              </div>

              <Card className="modern-card hover-lift">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <Link href={action.href} key={action.title}>
                      <Button variant="outline" className="quick-action-btn">
                        <div className={`w-10 h-10 rounded-xl ${action.bgColor} flex items-center justify-center`}>
                          <action.icon className={`w-5 h-5 ${action.color}`} />
                        </div>
                        <span className="text-xs font-medium leading-tight">{action.title}</span>
                      </Button>
                    </Link>
                  ))}
                </CardContent>
              </Card>

              <Card className="modern-card hover-lift">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Fishing Goals</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Safety Checks</span>
                      <span className="text-sm text-muted-foreground">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Journal Entries</span>
                      <span className="text-sm text-muted-foreground">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
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
