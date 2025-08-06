"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowRight, MapPin, CloudSun, Shield, Scale, MessageCircle, LifeBuoy, Bot, Users, Zap, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const features = [
    {
      title: "Interactive Map",
      description: "Explore fishing spots, track your location, and discover points of interest in real-time.",
      icon: MapPin,
      href: "/map",
      color: "from-custom-primary to-custom-secondary",
      bgColor: "bg-custom-primary/10"
    },
    {
      title: "Weather Dashboard",
      description: "Access AI-powered forecasts, and fishing analytics to plan your perfect trip.",
      icon: CloudSun,
      href: "/dashboard",
      color: "from-custom-secondary to-custom-primary",
      bgColor: "bg-custom-secondary/10"
    },
    {
      title: "Fishing Laws",
      description: "Navigate complex fishing regulations with our AI-powered legal assistant.",
      icon: Scale,
      href: "/laws",
      color: "from-custom-primary to-custom-secondary",
      bgColor: "bg-custom-primary/10"
    },
    {
      title: "Safety Guidelines",
      description: "Stay safe on the water with essential safety information and best practices.",
      icon: Shield,
      href: "/safety",
      color: "from-custom-secondary to-custom-primary",
      bgColor: "bg-custom-secondary/10"
    },
    {
      title: "AI Assistant",
      description: "Chat with our intelligent AI for personalized fishing advice and real-time support.",
      icon: MessageCircle,
      href: "/chat",
      color: "from-custom-primary to-custom-secondary",
      bgColor: "bg-custom-primary/10"
    },
    {
        title: "Emergency SOS",
        description: "Instantly alert emergency contacts and authorities with your location.",
        icon: LifeBuoy,
        href: "/dashboard", // SOS is on the dashboard
        color: "from-custom-primary to-custom-secondary",
        bgColor: "bg-custom-primary/10"
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
    "Comprehensive fishing laws database",
    "Multi-language support for regional communities"
  ];

  return (
    <div className="min-h-screen w-full bg-custom-white dark:bg-black overflow-x-hidden">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 px-4 md:px-8 text-center">
          <div className="absolute inset-0 -z-10 h-full w-full bg-custom-light bg-[linear-gradient(to_right,#f4f3ee_1px,transparent_1px),linear-gradient(to_bottom,#f4f3ee_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-black dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] opacity-30"></div>
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-medium text-foreground dark:text-custom-white mb-6 tracking-tight leading-tight font-claude text-center">
              Aquora.AI
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground dark:text-custom-secondary max-w-3xl mx-auto leading-relaxed mb-10 font-claude text-center">
              Your intelligent fishing companion for safer, smarter, and more successful trips on the water.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <Link href={user ? "/dashboard" : "/login"}>
                    <Button size="lg" className="gap-3 px-8 py-6 text-base font-medium bg-custom-primary hover:bg-custom-primary/90 text-custom-white rounded-lg transition-colors duration-200 font-claude">
                        {user ? "Go to Dashboard" : "Get Started Free"}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
                <Link href="#features">
                    <Button variant="outline" size="lg" className="gap-3 px-8 py-6 text-base font-medium border-custom-secondary hover:bg-custom-secondary/10 text-custom-secondary rounded-lg transition-colors duration-200 font-claude">
                        Learn More
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-semibold text-foreground dark:text-custom-white font-claude">{stat.value}</div>
                  <div className="text-sm text-muted-foreground dark:text-custom-secondary font-claude">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-medium text-foreground dark:text-custom-white mb-4 font-claude">
                Everything You Need for Successful Fishing
              </h2>
              <p className="text-lg text-muted-foreground dark:text-custom-secondary max-w-3xl mx-auto font-claude">
                Discover comprehensive tools designed specifically for modern anglers who demand precision and reliability.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group bg-white dark:bg-gray-900 border border-custom-secondary/20 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:border-custom-primary/40"
                >
                  <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 text-custom-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground dark:text-custom-white mb-4 font-claude">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground dark:text-custom-secondary text-base leading-relaxed mb-6 font-claude">
                    {feature.description}
                  </p>
                  <Link href={feature.href}>
                    <Button
                      variant="outline"
                      className="group-hover:bg-custom-primary group-hover:text-custom-white group-hover:border-custom-primary transition-all duration-300 font-claude"
                    >
                      Explore <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 px-4 md:px-8 bg-custom-light dark:bg-gray-900">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12 text-center">
              <h2 className="text-3xl lg:text-4xl font-medium text-foreground dark:text-custom-white mb-4 font-claude">
                Why Choose Aquora.AI?
              </h2>
              <p className="text-muted-foreground dark:text-custom-secondary text-base max-w-3xl mx-auto font-claude">
                We combine cutting-edge technology with a passion for fishing to create an indispensable tool for anglers of all levels.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 border border-custom-secondary/20 rounded-2xl p-8">
                  <div className="w-14 h-14 bg-custom-primary/10 dark:bg-custom-primary/20 rounded-2xl flex items-center justify-center mb-6">
                    <Bot className="w-6 h-6 text-custom-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 font-claude">AI-Powered Intelligence</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-claude">Get predictive insights on the best times and locations to fish, all powered by advanced AI models.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-custom-secondary/20 rounded-2xl p-8">
                  <div className="w-14 h-14 bg-custom-secondary/10 dark:bg-custom-secondary/20 rounded-2xl flex items-center justify-center mb-6">
                    <CloudSun className="w-6 h-6 text-custom-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 font-claude">All-in-One Data Hub</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-claude">Access live weather, water conditions, maps, and legal information in a single, easy-to-use interface.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 border border-custom-secondary/20 rounded-2xl p-8">
                  <div className="w-14 h-14 bg-custom-primary/10 dark:bg-custom-primary/20 rounded-2xl flex items-center justify-center mb-6">
                    <Shield className="w-6 h-6 text-custom-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 font-claude">Uncompromised Safety</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-claude">With SOS features and up-to-date safety guidelines, we prioritize your well-being on every trip.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-custom-secondary/20 rounded-2xl p-8">
                  <div className="w-14 h-14 bg-custom-secondary/10 dark:bg-custom-secondary/20 rounded-2xl flex items-center justify-center mb-6">
                    <Zap className="w-6 h-6 text-custom-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3 font-claude">Lightning Fast</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed font-claude">Optimized for speed and performance, ensuring you get the information you need when you need it.</p>
                </div>
              </div>
            </div>

            {/* Feature List */}
            <div className="mt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-custom-secondary/20 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-custom-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground font-claude">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}