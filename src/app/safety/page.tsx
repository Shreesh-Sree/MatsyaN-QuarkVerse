"use client";

import { SafetyTips } from "@/components/SafetyTips";
import ProtectedRoute from "@/components/ProtectedRoute";
import Image from "next/image";

export default function SafetyPage() {
  const features = [
    { text: "Emergency Procedures", color: "text-red-600" },
    { text: "Best Practices", color: "text-green-600" },
    { text: "SOS System", color: "text-blue-600" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-1 container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 border border-red-200 text-red-700 text-sm font-medium mb-6">
                      <Image src="/favicon.ico" alt="Safety" width={16} height={16} />
                      Safety First
                    </div>
                    <div className="inline-block bg-red-50 p-4 rounded-2xl mb-6 border border-red-200">
                        <Image src="/favicon.ico" alt="Safety Icon" width={48} height={48} />
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
                          <Image src="/favicon.ico" alt="Feature" width={16} height={16} />
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
