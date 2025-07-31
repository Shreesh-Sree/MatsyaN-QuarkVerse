"use client";

import GoogleMapCard from "@/components/GoogleMapCard";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function MapPage() {
  const features = [
    { text: "Real-time Location" },
    { text: "Fishing Spots" },
    { text: "Weather Data" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-custom-white dark:bg-black">
        <main className="flex-1 flex flex-col container mx-auto py-6 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-medium text-foreground dark:text-custom-white mb-2 font-claude">
                    Interactive Fishing Map
                </h1>
                <p className="text-muted-foreground dark:text-custom-secondary text-base font-claude mb-6">
                    Explore fishing spots, see real-time data, and track your location with precision.
                </p>
                
                {/* Feature badges */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="px-4 py-2 rounded-lg bg-custom-light dark:bg-gray-800 border border-custom-secondary/20 text-sm">
                      <span className="text-foreground dark:text-custom-white font-medium font-claude">{feature.text}</span>
                    </div>
                  ))}
                </div>
            </div>
            <div className="flex-1 h-[65vh] md:h-[70vh] border border-custom-secondary/20 bg-custom-white dark:bg-gray-900 rounded-lg p-2 md:p-4">
                <GoogleMapCard />
            </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
