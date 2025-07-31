"use client";

import { FishingLawsChat } from "@/components/FishingLawsChat";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Scale, Gavel, BookOpen, AlertCircle } from "lucide-react";

export default function LawsPage() {
  const features = [
    { icon: Gavel, text: "Legal Guidelines", color: "text-firebase-orange" },
    { icon: BookOpen, text: "Regulations", color: "text-google-blue" },
    { icon: AlertCircle, text: "Compliance", color: "text-firebase-yellow" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-1 container mx-auto py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-firebase-orange/10 border border-firebase-orange/20 text-firebase-orange text-sm font-medium mb-6">
                      <Scale className="w-4 h-4" />
                      Legal Assistant
                    </div>
                    <div className="inline-block bg-firebase-orange/10 p-4 rounded-2xl mb-6 border border-firebase-orange/20">
                        <Scale className="w-12 h-12 text-firebase-orange" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        Fishing Laws & Regulations
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                        Use our AI assistant to get clear, concise answers about fishing laws in your area.
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
                <div className="modern-card p-0 hover-lift">
                    <FishingLawsChat />
                </div>
            </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
