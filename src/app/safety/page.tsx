"use client";

import { SafetyTips } from "@/components/SafetyTips";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Shield, AlertTriangle, CheckCircle, LifeBuoy } from "lucide-react";

export default function SafetyPage() {
  const features = [
    { text: "Emergency Procedures" },
    { text: "Best Practices" },
    { text: "SOS System" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-custom-white dark:bg-black">
        <main className="flex-1 container mx-auto py-6 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-medium text-foreground dark:text-custom-white mb-2 font-['Inter']">
                        Safety Tips & Guidelines
                    </h1>
                    <p className="text-muted-foreground dark:text-custom-secondary text-base font-['Inter'] mb-6">
                        Your comprehensive guide to staying safe on the water. Essential information for every angler.
                    </p>
                    
                    {/* Feature badges */}
                    <div className="flex flex-wrap gap-3 mb-8">
                      {features.map((feature, index) => (
                        <div key={index} className="px-4 py-2 rounded-lg bg-custom-light dark:bg-gray-800 border border-custom-secondary/20 text-sm">
                          <span className="text-foreground dark:text-custom-white font-medium">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                </div>
                <div className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900 rounded-lg">
                    <SafetyTips />
                </div>
            </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
