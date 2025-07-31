"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { MapPin, CloudSun, Shield, Scale, BarChart3, MessageCircle, LifeBuoy, Download, Bot, ArrowRight, Star, Users, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const features = [
    {
      title: "Interactive Map",
      description: "Explore fishing spots, track your location, and discover points of interest in real-time.",
      icon: MapPin,
      href: "/map",
      color: "from-blue-500 to-cyan-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Weather Dashboard",
      description: "Access AI-powered forecasts, and fishing analytics to plan your perfect trip.",
      icon: CloudSun,
      href: "/dashboard",
      color: "from-green-500 to-emerald-400",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Fishing Laws",
      description: "Navigate complex fishing regulations with our AI-powered legal assistant.",
      icon: Scale,
      href: "/laws",
      color: "from-purple-500 to-violet-400",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Safety Guidelines",
      description: "Stay safe on the water with essential safety information and best practices.",
      icon: Shield,
      href: "/safety",
      color: "from-red-500 to-orange-400",
      bgColor: "bg-red-500/10"
    },
    {
      title: "AI Assistant",
      description: "Chat with our intelligent AI for personalized fishing advice and real-time support.",
      icon: MessageCircle,
      href: "/chat",
      color: "from-indigo-500 to-purple-400",
      bgColor: "bg-indigo-500/10"
    },
    {
        title: "Emergency SOS",
        description: "Instantly alert emergency contacts and authorities with your location.",
        icon: LifeBuoy,
        href: "/dashboard", // SOS is on the dashboard
        color: "from-pink-500 to-rose-400",
        bgColor: "bg-pink-500/10"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Users", icon: Users },
    { value: "50K+", label: "Fishing Spots", icon: MapPin },
    { value: "99.9%", label: "Uptime", icon: Zap },
    { value: "4.9★", label: "User Rating", icon: Star },
  ];

  const benefits = [
    "AI-powered fishing predictions",
    "Real-time weather & safety alerts",
    "Offline functionality",
    "Voice-controlled navigation",
    "Emergency SOS system",
    "Comprehensive fishing laws database"
  ];

  return (
    <div className="min-h-screen w-full bg-background gradient-bg text-foreground overflow-x-hidden">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 px-4 md:px-8 text-center animate-fade-in">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-background dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] opacity-30"></div>
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 text-sm font-medium mb-8 animate-fade-in-up">
              <Bot className="w-4 h-4" />
              AI-Powered Fishing Companion
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-gradient mb-8 tracking-tighter leading-tight animate-fade-in-up">
              FisherMate.AI
            </h1>
            <p className="text-xl lg:text-2xl text-enhanced max-w-3xl mx-auto leading-relaxed mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Your intelligent fishing companion for safer, smarter, and more successful trips on the water.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <Link href={user ? "/dashboard" : "/login"}>
                    <Button size="lg" className="gap-3 px-10 py-7 text-lg font-semibold shadow-soft hover:scale-[1.05] transition-all duration-500 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 rounded-2xl">
                        {user ? "Go to Dashboard" : "Get Started Free"}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                </Link>
                <Link href="/about">
                    <Button size="lg" variant="outline" className="px-10 py-7 text-lg font-semibold glass-button hover:scale-[1.05] transition-all duration-500 rounded-2xl border-2">
                        Learn More
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 mx-auto mb-3">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 animate-fade-in-up">
                <span className="text-blue-500 font-semibold text-sm uppercase tracking-wider">Our Features</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-4 mb-6">
                Everything You Need for a Great Day on the Water
                </h2>
                <p className="text-enhanced text-lg max-w-2xl mx-auto">
                    From real-time data to AI-powered assistance, we&apos;ve got you covered.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {features.map((feature) => (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group modern-card hover:border-blue-500/50 hover:-translate-y-4 focus-ring animate-fade-in-up hover-lift"
                  style={{animationDelay: `${features.indexOf(feature) * 0.1}s`}}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-enhanced leading-relaxed">
                    {feature.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 px-4 md:px-8 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Why Choose FisherMate.AI?
              </h2>
              <p className="text-lg text-enhanced max-w-3xl mx-auto">
                We combine cutting-edge technology with a passion for fishing to create an indispensable tool for anglers of all levels.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              <div className="space-y-6">
                <div className="glass-card-sm p-8 hover-lift animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Bot className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">AI-Powered Intelligence</h3>
                  <p className="text-enhanced text-sm leading-relaxed">Get predictive insights on the best times and locations to fish, all powered by advanced AI models.</p>
                </div>
                <div className="glass-card-sm p-8 hover-lift animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <CloudSun className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">All-in-One Data Hub</h3>
                  <p className="text-enhanced text-sm leading-relaxed">Access live weather, water conditions, maps, and legal information in a single, easy-to-use interface.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="glass-card-sm p-8 hover-lift animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500/20 to-red-600/30 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Uncompromised Safety</h3>
                  <p className="text-enhanced text-sm leading-relaxed">With SOS features and up-to-date safety guidelines, we prioritize your well-being on every trip.</p>
                </div>
                <div className="glass-card-sm p-8 hover-lift animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Lightning Fast</h3>
                  <p className="text-enhanced text-sm leading-relaxed">Optimized for speed and performance, ensuring you get the information you need when you need it.</p>
                </div>
              </div>
            </div>

            {/* Feature List */}
            <div className="mt-16 animate-fade-in-up" style={{animationDelay: '0.7s'}}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 glass-card-sm rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="text-center p-12 border-t border-border/30 bg-gradient-to-t from-muted/20 to-background">
        <div className="max-w-4xl mx-auto">
          <p className="text-enhanced">&copy; {new Date().getFullYear()} FisherMate.AI. All rights reserved.</p>
          <p className="text-sm text-enhanced/80 mt-3">
            Made with ❤️ by QuarkVerse, powered by Google Cloud and Gemini.
          </p>
        </div>
      </footer>
    </div>
  );
}