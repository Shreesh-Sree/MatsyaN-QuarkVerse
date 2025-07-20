'use client';

import { Fish, Map, Shield, Scale, Bot, Sun, Wind, Droplets, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    { title: "Find Fishing Spots", href: "/map", icon: Map, color: "text-blue-500" },
    { title: "Safety Guidelines", href: "/safety", icon: Shield, color: "text-green-500" },
    { title: "Fishing Regulations", href: "/laws", icon: Scale, color: "text-purple-500" },
    { title: "AI Assistant", href: "/chat", icon: Bot, color: "text-indigo-500" },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-background gradient-bg text-foreground">
        <main className="container mx-auto px-4 py-8 space-y-8 animate-fade-in">
          
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12 animate-fade-in-up">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-3">
                Welcome, {user?.email?.split('@')[0] || 'Fisher'}!
              </h1>
              <p className="text-enhanced text-lg">
                Here&apos;s your dashboard for a successful day on the water.
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

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-10">
              {/* Voice Assistant */}
              <Card className="modern-card animate-fade-in-up hover-lift" style={{animationDelay: '0.1s'}}>
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
              <div data-section="journal" className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <ErrorBoundary fallback={<Card className="modern-card"><CardContent><p>Could not load Fishing Journal.</p></CardContent></Card>}>
                  <FishingJournal />
                </ErrorBoundary>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-10">
              {/* Weather Card */}
              <div data-section="weather" className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <ErrorBoundary fallback={<Card className="modern-card"><CardContent><p>Could not load Weather Card.</p></CardContent></Card>}>
                  <WeatherCard />
                </ErrorBoundary>
              </div>

              {/* Analytics Card */}
              <div data-section="analytics" className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <ErrorBoundary fallback={<Card className="modern-card"><CardContent><p>Could not load Fishing Analytics.</p></CardContent></Card>}>
                  <FishingAnalyticsCard />
                </ErrorBoundary>
              </div>

              {/* Quick Actions */}
              <Card className="modern-card animate-fade-in-up hover-lift" style={{animationDelay: '0.5s'}}>
                <CardHeader>
                  <CardTitle className="text-xl text-gradient">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  {quickActions.map((action) => (
                    <Link href={action.href} key={action.title}>
                      <Button variant="outline" className="w-full h-28 flex flex-col items-center justify-center gap-3 text-center p-4 glass-button hover:scale-105 transition-all duration-300 rounded-xl">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                          <action.icon className={`w-5 h-5 ${action.color}`} />
                        </div>
                        <span className="text-xs font-medium leading-tight">{action.title}</span>
                      </Button>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
