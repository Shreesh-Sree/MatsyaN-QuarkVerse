"use client";

import GoogleMapCard from "@/components/GoogleMapCard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { MapPin, Navigation, Target, Compass } from "lucide-react";

export default function MapPage() {
  const features = [
    { icon: Navigation, text: "Real-time Location", color: "text-google-blue" },
    { icon: Target, text: "Fishing Spots", color: "text-android-green" },
    { icon: Compass, text: "Weather Data", color: "text-firebase-orange" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-1 flex flex-col container mx-auto py-8 px-4">
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-google-blue/10 border border-google-blue/20 text-google-blue text-sm font-medium mb-6">
                  <MapPin className="w-4 h-4" />
                  Interactive Mapping
                </div>
                <div className="inline-block bg-google-blue/10 p-4 rounded-2xl mb-6 border border-google-blue/20">
                    <MapPin className="w-12 h-12 text-google-blue" />
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
                    Interactive Fishing Map
                </h1>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                    Explore fishing spots, see real-time data, and track your location with precision.
                </p>
                
                {/* Feature badges */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50 border border-gray-200 text-sm">
                      <feature.icon className={`w-4 h-4 ${feature.color}`} />
                      <span className="text-foreground">{feature.text}</span>
                    </div>
                  ))}
                </div>
            </div>
            <div className="flex-1 h-[65vh] md:h-[70vh] modern-card p-2 md:p-4 hover-lift">
                <GoogleMapCard />
            </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
