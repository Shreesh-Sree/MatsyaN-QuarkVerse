"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  const { t } = useLanguage();
  const { user } = useAuth();

  const features = [
    {
      title: "Interactive Map",
      description: "Explore fishing spots, track your location, and discover points of interest in real-time.",
      href: "/map",
      color: "from-blue-500 to-cyan-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Weather Dashboard",
      description: "Access AI-powered forecasts, and fishing analytics to plan your perfect trip.",
      href: "/dashboard",
      color: "from-green-500 to-emerald-400",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Fishing Laws",
      description: "Navigate complex fishing regulations with our AI-powered legal assistant.",
      href: "/laws",
      color: "from-purple-500 to-violet-400",
      bgColor: "bg-purple-500/10"
    },
    {
      title: "Safety Guidelines",
      description: "Stay safe on the water with essential safety information and best practices.",
      href: "/safety",
      color: "from-red-500 to-orange-400",
      bgColor: "bg-red-500/10"
    },
    {
      title: "AI Assistant",
      description: "Chat with our intelligent AI for personalized fishing advice and real-time support.",
      href: "/chat",
      color: "from-indigo-500 to-purple-400",
      bgColor: "bg-indigo-500/10"
    },
    {
        title: "Emergency SOS",
        description: "Instantly alert emergency contacts and authorities with your location.",
        href: "/dashboard", // SOS is on the dashboard
        color: "from-pink-500 to-rose-400",
        bgColor: "bg-pink-500/10"
    }
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "50K+", label: "Fishing Spots" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9★", label: "User Rating" },
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
    <div className="min-h-screen w-full bg-background text-foreground overflow-x-hidden">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 lg:py-32 px-4 md:px-8 text-center">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-background dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] opacity-30"></div>
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-8">
              <Image src="/favicon.ico" alt="AI" width={16} height={16} />
              AI-Powered Fishing Companion
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-8 tracking-tight leading-tight">
              FisherMate.AI
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-12">
              Your intelligent fishing companion for safer, smarter, and more successful trips on the water.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                <Link href={user ? "/dashboard" : "/login"}>
                    <Button size="lg" className="gap-3 px-10 py-7 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200">
                        {user ? "Go to Dashboard" : "Get Started Free"}
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </Link>
                <Link href="/about">
                    <Button size="lg" variant="outline" className="px-10 py-7 text-lg font-semibold border-2 rounded-xl transition-colors duration-200">
                        Learn More
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 mx-auto mb-3">
                    <Image src="/favicon.ico" alt="Icon" width={24} height={24} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
                <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Features</span>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground mt-4 mb-6">
                Everything You Need for a Great Day on the Water
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    From real-time data to AI-powered assistance, we&apos;ve got you covered.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {features.map((feature) => (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:border-blue-300 dark:hover:border-blue-600 transition-colors duration-200"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                    <Image src="/favicon.ico" alt="Feature" width={28} height={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-blue-600 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 px-4 md:px-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Why Choose FisherMate.AI?
              </h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                We combine cutting-edge technology with a passion for fishing to create an indispensable tool for anglers of all levels.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6">
                    <Image src="/favicon.ico" alt="AI" width={24} height={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">AI-Powered Intelligence</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Get predictive insights on the best times and locations to fish, all powered by advanced AI models.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                  <div className="w-14 h-14 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mb-6">
                    <Image src="/favicon.ico" alt="Data" width={24} height={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">All-in-One Data Hub</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Access live weather, water conditions, maps, and legal information in a single, easy-to-use interface.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                  <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-6">
                    <Image src="/favicon.ico" alt="Safety" width={24} height={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Uncompromised Safety</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">With SOS features and up-to-date safety guidelines, we prioritize your well-being on every trip.</p>
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8">
                  <div className="w-14 h-14 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-6">
                    <Image src="/favicon.ico" alt="Speed" width={24} height={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Lightning Fast</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Optimized for speed and performance, ensuring you get the information you need when you need it.</p>
                </div>
              </div>
            </div>

            {/* Feature List */}
            <div className="mt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <Image src="/favicon.ico" alt="Check" width={20} height={20} className="text-green-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground">{benefit}</span>
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