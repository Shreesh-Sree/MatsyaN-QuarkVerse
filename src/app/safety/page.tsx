"use client";

import { SafetyTips } from "@/components/SafetyTips";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Shield, AlertTriangle, CheckCircle, LifeBuoy } from "lucide-react";

export default function SafetyPage() {
  const features = [
    { icon: AlertTriangle, text: "Emergency Procedures", color: "text-firebase-red" },
    { icon: CheckCircle, text: "Best Practices", color: "text-android-green" },
    { icon: LifeBuoy, text: "SOS System", color: "text-google-blue" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-1 container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-firebase-red/10 border border-firebase-red/20 text-firebase-red text-sm font-medium mb-6">
                      <Shield className="w-4 h-4" />
                      Safety First
                    </div>
                    <div className="inline-block bg-firebase-red/10 p-4 rounded-2xl mb-6 border border-firebase-red/20">
                        <Shield className="w-12 h-12 text-firebase-red" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        Safety Tips & Guidelines
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                        Your comprehensive guide to staying safe on the water. Essential information for every angler.
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
                <div className="modern-card hover-lift">
                    <SafetyTips />
                </div>
            </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
