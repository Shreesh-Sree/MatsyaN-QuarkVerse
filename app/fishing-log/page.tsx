"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Fish, Map, Shield, Scale, Bot, Clock, Target, Zap, Activity, AlertTriangle, CheckCircle, XCircle, BookOpen, BarChart3, MessageSquare, Settings, Database, TrendingUp, MapPin, Calendar } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNetworkStatus } from '@/hooks/use-offline';
import { useFishingLogs } from '@/hooks/use-fishing-logs';
import ProtectedRoute from '@/components/ProtectedRoute';
import ErrorBoundary from '@/components/ErrorBoundary';
import { FishingJournal } from '@/components/fishing-journal/FishingJournalClean';
import { FishingDataInfographics } from '@/components/FishingDataInfographics';
import GoogleVoiceAssistant from '@/components/GoogleVoiceAssistant';
import { geminiService } from '@/services/gemini';
import Link from 'next/link';

export default function FishingInfoCenter() {
  const { user } = useAuth();
  const { online: isOnline } = useNetworkStatus();
  const { syncStatus } = useFishingLogs();
  const [networkStatus] = useState({ online: isOnline });
  const [activeTab, setActiveTab] = useState("overview");
  const [lawQuery, setLawQuery] = useState("");
  const [safetyQuery, setSafetyQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleVoiceCommand = (transcript: string) => {
    console.log('Voice command received:', transcript);
    // Handle voice commands here
    if (transcript.toLowerCase().includes('laws')) {
      setActiveTab('laws');
    } else if (transcript.toLowerCase().includes('safety')) {
      setActiveTab('safety');
    } else if (transcript.toLowerCase().includes('analytics')) {
      setActiveTab('analytics');
    } else if (transcript.toLowerCase().includes('journal')) {
      setActiveTab('journal');
    }
  };

  const handleLawQuery = async () => {
    if (!lawQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await geminiService.getFishingLaws({
        query: lawQuery,
        state: "Maharashtra", // Default state, can be made dynamic
        country: "India"
      });
      setAiResponse(response);
    } catch (error) {
      setAiResponse("Sorry, I couldn't retrieve the fishing law information. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSafetyQuery = async () => {
    if (!safetyQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await geminiService.getSafetyGuidelines({
        query: safetyQuery,
        location: "Arabian Sea", // Default location, can be made dynamic
        fishingType: "Deep Sea"
      });
      setAiResponse(response);
    } catch (error) {
      setAiResponse("Sorry, I couldn't retrieve the safety information. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { title: "Find Fishing Spots", href: "/map", color: "bg-custom-primary text-custom-white hover:bg-custom-primary/90", icon: Map },
    { title: "Safety Guidelines", href: "/safety", color: "bg-custom-secondary text-custom-white hover:bg-custom-secondary/90", icon: Shield },
    { title: "Fishing Regulations", href: "/laws", color: "bg-custom-primary text-custom-white hover:bg-custom-primary/90", icon: Scale },
    { title: "AI Assistant", href: "/chat", color: "bg-custom-secondary text-custom-white hover:bg-custom-secondary/90", icon: Bot },
  ];

  const statsData = [
    { label: "Total Catches", value: "127", trend: "+12%", icon: Fish },
    { label: "Fishing Hours", value: "89", trend: "+8%", icon: Clock },
    { label: "Success Rate", value: "78%", trend: "+5%", icon: Target },
    { label: "Active Streak", value: "15", trend: "+3", icon: Zap },
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
              Fishing Information Center
            </h1>
            <p className="text-muted-foreground dark:text-custom-secondary text-base font-claude">
              Complete fishing resource hub with AI assistance, analytics, journal, laws, and safety guidelines.
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

          {/* Main Tabs Interface */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-custom-light dark:bg-gray-800 border border-custom-secondary/20">
              <TabsTrigger value="overview" className="flex items-center gap-2 font-claude">
                <Activity className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2 font-claude">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="journal" className="flex items-center gap-2 font-claude">
                <BookOpen className="w-4 h-4" />
                Journal
              </TabsTrigger>
              <TabsTrigger value="laws" className="flex items-center gap-2 font-claude">
                <Scale className="w-4 h-4" />
                Laws & AI
              </TabsTrigger>
              <TabsTrigger value="safety" className="flex items-center gap-2 font-claude">
                <Shield className="w-4 h-4" />
                Safety & AI
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsData.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <Card key={stat.label} className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900 hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <IconComponent className="w-4 h-4 text-custom-primary" />
                            <p className="text-sm font-medium text-custom-secondary dark:text-custom-secondary font-claude">
                              {stat.label}
                            </p>
                          </div>
                          <span className="text-xs text-custom-primary font-medium font-claude">
                            {stat.trend}
                          </span>
                        </div>
                        <p className="text-2xl font-semibold text-foreground dark:text-custom-white font-claude">
                          {stat.value}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Voice Assistant */}
                <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium text-foreground dark:text-custom-white font-claude flex items-center gap-2">
                      <Bot className="w-5 h-5 text-custom-primary" />
                      Voice Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground dark:text-custom-secondary mb-4 text-sm font-claude">
                      Use voice commands to navigate. Try "show laws", "safety info", "analytics", or "journal".
                    </p>
                    <ErrorBoundary fallback={<p className="text-custom-primary font-claude">Voice assistant is currently unavailable.</p>}>
                      <GoogleVoiceAssistant onTranscript={handleVoiceCommand} />
                    </ErrorBoundary>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium text-foreground dark:text-custom-white font-claude">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {quickActions.map((action) => {
                      const IconComponent = action.icon;
                      return (
                        <Link href={action.href} key={action.title} className="block">
                          <Button 
                            className={`w-full ${action.color} border-0 rounded-lg font-medium text-sm py-3 font-claude`}
                            variant="default"
                          >
                            <IconComponent className="w-4 h-4 mr-2" />
                            {action.title}
                          </Button>
                        </Link>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Weekly Progress */}
                <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-medium text-foreground dark:text-custom-white font-claude flex items-center gap-2">
                      <Activity className="w-5 h-5 text-custom-primary" />
                      Weekly Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground dark:text-custom-white font-claude flex items-center gap-2">
                          <Target className="w-4 h-4 text-custom-primary" />
                          Fishing Goals
                        </span>
                        <span className="text-sm text-muted-foreground dark:text-custom-secondary font-claude">75%</span>
                      </div>
                      <Progress value={75} className="h-2 bg-custom-light dark:bg-gray-700" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground dark:text-custom-white font-claude flex items-center gap-2">
                          <Shield className="w-4 h-4 text-custom-primary" />
                          Safety Checks
                        </span>
                        <span className="text-sm text-muted-foreground dark:text-custom-secondary font-claude">100%</span>
                      </div>
                      <Progress value={100} className="h-2 bg-custom-light dark:bg-gray-700" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-foreground dark:text-custom-white font-claude flex items-center gap-2">
                          <Clock className="w-4 h-4 text-custom-primary" />
                          Journal Entries
                        </span>
                        <span className="text-sm text-muted-foreground dark:text-custom-secondary font-claude">60%</span>
                      </div>
                      <Progress value={60} className="h-2 bg-custom-light dark:bg-gray-700" />
                    </div>
                  </CardContent>
                </Card>
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
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <ErrorBoundary fallback={
                <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
                  <CardContent className="p-4">
                    <p className="text-custom-primary font-claude">Could not load Fishing Data Analytics.</p>
                  </CardContent>
                </Card>
              }>
                <FishingDataInfographics />
              </ErrorBoundary>
            </TabsContent>

            {/* Journal Tab */}
            <TabsContent value="journal" className="space-y-6">
              <ErrorBoundary fallback={
                <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
                  <CardContent className="p-4">
                    <p className="text-custom-primary font-claude">Could not load Fishing Journal.</p>
                  </CardContent>
                </Card>
              }>
                <FishingJournal />
              </ErrorBoundary>
            </TabsContent>

            {/* Laws & AI Tab */}
            <TabsContent value="laws" className="space-y-6">
              <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium text-foreground dark:text-custom-white font-claude flex items-center gap-2">
                    <Scale className="w-5 h-5 text-custom-primary" />
                    Fishing Laws & Regulations AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground dark:text-custom-white font-claude">
                      Ask about fishing laws and regulations:
                    </label>
                    <Textarea
                      placeholder="e.g., What are the fishing license requirements in Maharashtra? What are the catch limits for mackerel?"
                      value={lawQuery}
                      onChange={(e) => setLawQuery(e.target.value)}
                      className="min-h-20 border-custom-secondary/30"
                    />
                  </div>
                  <Button 
                    onClick={handleLawQuery}
                    disabled={isLoading || !lawQuery.trim()}
                    className="w-full bg-custom-primary text-custom-white hover:bg-custom-primary/90 font-claude"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Getting Laws Info...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Ask AI Assistant
                      </>
                    )}
                  </Button>
                  {aiResponse && (
                    <div className="mt-4 p-4 bg-custom-light dark:bg-gray-800 rounded-lg border border-custom-secondary/20">
                      <h4 className="font-medium text-foreground dark:text-custom-white mb-2 font-claude">AI Response:</h4>
                      <div className="text-sm text-foreground dark:text-custom-white whitespace-pre-wrap font-claude">
                        {aiResponse}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Safety & AI Tab */}
            <TabsContent value="safety" className="space-y-6">
              <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-medium text-foreground dark:text-custom-white font-claude flex items-center gap-2">
                    <Shield className="w-5 h-5 text-custom-primary" />
                    Fishing Safety Guidelines AI Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground dark:text-custom-white font-claude">
                      Ask about fishing safety and best practices:
                    </label>
                    <Textarea
                      placeholder="e.g., What safety equipment do I need for deep sea fishing? How to handle rough weather conditions?"
                      value={safetyQuery}
                      onChange={(e) => setSafetyQuery(e.target.value)}
                      className="min-h-20 border-custom-secondary/30"
                    />
                  </div>
                  <Button 
                    onClick={handleSafetyQuery}
                    disabled={isLoading || !safetyQuery.trim()}
                    className="w-full bg-custom-secondary text-custom-white hover:bg-custom-secondary/90 font-claude"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Getting Safety Info...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Ask Safety AI
                      </>
                    )}
                  </Button>
                  {aiResponse && (
                    <div className="mt-4 p-4 bg-custom-light dark:bg-gray-800 rounded-lg border border-custom-secondary/20">
                      <h4 className="font-medium text-foreground dark:text-custom-white mb-2 font-claude">AI Response:</h4>
                      <div className="text-sm text-foreground dark:text-custom-white whitespace-pre-wrap font-claude">
                        {aiResponse}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ProtectedRoute>
  );
}
