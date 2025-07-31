'use client';

import { Fish, Map, Shield, Scale, Bot, Sun, Wind, Droplets, BarChart3, TrendingUp, Calendar, Clock, Target, Zap, Users, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { WeatherCard } from '@/components/WeatherCard';
import FishingAnalyticsCard from '@/components/FishingAnalyticsCard';
import { FishingJournal } from '@/components/fishing-journal/FishingJournal';
import { GoogleVoiceAssistant } from '@/components/GoogleVoiceAssistant';
import ProtectedRoute from '@/components/ProtectedRoute';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useNetworkStatus } from '@/hooks/use-offline';
import { useFishingLogs } from '@/hooks/use-fishing-logs';
import Link from 'next/link';

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const networkStatus = useNetworkStatus();
  const { logs, addLog, syncOfflineLogs, isOnline, syncStatus, stats } = useFishingLogs();

  if (!user) {
    return null; // ProtectedRoute will handle the redirect
  }

  const handleVoiceCommand = (transcript: string) => {
    if (!transcript || typeof transcript !== 'string') {
      console.warn('Invalid transcript received:', transcript);
      return;
    }
    const lowerTranscript = transcript.toLowerCase();
    const scrollTo = (selector: string) => document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });

    if (lowerTranscript.includes('weather')) scrollTo('[data-section="weather"]');
    else if (lowerTranscript.includes('journal') || lowerTranscript.includes('log')) scrollTo('[data-section="journal"]');
    else if (lowerTranscript.includes('analytics')) scrollTo('[data-section="analytics"]');
    else if (lowerTranscript.includes('map')) window.location.href = '/map';
    else if (lowerTranscript.includes('safety')) window.location.href = '/safety';
  };

  const quickActions = [
    { title: "Find Fishing Spots", href: "/map", icon: Map, color: "text-blue-500", bgColor: "bg-blue-500/10" },
    { title: "Safety Guidelines", href: "/safety", icon: Shield, color: "text-green-500", bgColor: "bg-green-500/10" },
    { title: "Fishing Regulations", href: "/laws", icon: Scale, color: "text-purple-500", bgColor: "bg-purple-500/10" },
    { title: "AI Assistant", href: "/chat", icon: Bot, color: "text-indigo-500", bgColor: "bg-indigo-500/10" },
  ];

  // Mock data for statistics
  const statsData = [
    { label: "Total Catches", value: "127", icon: Fish, color: "text-blue-500", bgColor: "bg-blue-500/10", trend: "+12%" },
    { label: "Fishing Hours", value: "89", icon: Clock, color: "text-green-500", bgColor: "bg-green-500/10", trend: "+8%" },
    { label: "Success Rate", value: "78%", icon: Target, color: "text-purple-500", bgColor: "bg-purple-500/10", trend: "+5%" },
    { label: "Active Streak", value: "15", icon: Zap, color: "text-orange-500", bgColor: "bg-orange-500/10", trend: "+3" },
  ];

  const recentActivity = [
    { type: "catch", message: "Caught a 2.5kg Bass", time: "2 hours ago", status: "success" },
    { type: "weather", message: "Weather alert: High winds", time: "4 hours ago", status: "warning" },
    { type: "location", message: "New fishing spot added", time: "6 hours ago", status: "info" },
    { type: "safety", message: "Safety check completed", time: "1 day ago", status: "success" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-background gradient-bg text-foreground">
        <main className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
          
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 animate-fade-in-up">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-3">
                Welcome back, {user?.email?.split('@')[0] || 'Fisher'}!
              </h1>
              <p className="text-enhanced text-lg">
                Ready for another great day on the water? Here's your personalized dashboard.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={networkStatus.online ? "default" : "destructive"} className="gap-2 px-4 py-2 rounded-full shadow-md">
                <div className={`w-2 h-2 rounded-full ${networkStatus.online ? 'bg-green-400' : 'bg-red-400'}`}></div>
                {networkStatus.online ? "Online" : "Offline"}
              </Badge>
              <Badge variant="outline" className="gap-2 px-4 py-2 rounded-full glass-card-sm">
                {syncStatus === 'syncing' ? "🔄 Syncing..." : isOnline ? "☁️ Synced" : "💾 Saved Locally"}
              </Badge>
            </div>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Voice Assistant */}
              <Card className="modern-card animate-fade-in-up hover-lift" style={{animationDelay: '0.2s'}}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-gradient">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                      <Bot className="w-5 h-5 text-primary animate-pulse" />
                    </div>
                    Voice Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-enhanced mb-6">
                    Use voice commands to navigate. Try &quot;show weather&quot; or &quot;open journal&quot;.
                  </p>
                  <ErrorBoundary fallback={<p className="text-destructive">Voice assistant is currently unavailable.</p>}>
                    <GoogleVoiceAssistant onTranscript={handleVoiceCommand} />
                  </ErrorBoundary>
                </CardContent>
              </Card>

              {/* Fishing Journal */}
              <div data-section="journal" className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <ErrorBoundary fallback={<Card className="modern-card"><CardContent><p>Could not load Fishing Journal.</p></CardContent></Card>}>
                  <FishingJournal />
                </ErrorBoundary>
              </div>

              {/* Recent Activity */}
              <Card className="modern-card animate-fade-in-up hover-lift" style={{animationDelay: '0.4s'}}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-xl text-gradient">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                      <Activity className="w-5 h-5 text-green-500" />
                    </div>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-4 glass-card-sm rounded-xl">
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

            {/* Right Column - Sidebar */}
            <div className="space-y-8">
              
              {/* Weather Card */}
              <div data-section="weather" className="animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                <ErrorBoundary fallback={<Card className="modern-card"><CardContent><p>Could not load Weather Card.</p></CardContent></Card>}>
                  <WeatherCard />
                </ErrorBoundary>
              </div>

              {/* Analytics Card */}
              <div data-section="analytics" className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <ErrorBoundary fallback={<Card className="modern-card"><CardContent><p>Could not load Fishing Analytics.</p></CardContent></Card>}>
                  <FishingAnalyticsCard />
                </ErrorBoundary>
              </div>

              {/* Quick Actions */}
              <Card className="modern-card animate-fade-in-up hover-lift" style={{animationDelay: '0.7s'}}>
                <CardHeader>
                  <CardTitle className="text-xl text-gradient">Quick Actions</CardTitle>
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

              {/* Progress Overview */}
              <Card className="modern-card animate-fade-in-up hover-lift" style={{animationDelay: '0.8s'}}>
                <CardHeader>
                  <CardTitle className="text-xl text-gradient">Weekly Progress</CardTitle>
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
