"use client";

import { Chatbot } from "@/components/Chatbot";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Bot, Shield, Scale, Zap } from "lucide-react";

export default function ChatPage() {
  const features = [
    { icon: Shield, text: "Safety Guidelines", color: "text-android-green" },
    { icon: Scale, text: "Fishing Regulations", color: "text-firebase-orange" },
    { icon: Zap, text: "Weather Insights", color: "text-google-blue" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gemini-pink/10 border border-gemini-pink/20 text-gemini-pink text-sm font-medium mb-6">
                <Bot className="w-4 h-4" />
                AI-Powered Assistant
              </div>
              <div className="inline-block bg-gemini-pink/10 p-4 rounded-2xl mb-6 border border-gemini-pink/20">
                  <Bot className="w-12 h-12 text-gemini-pink" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
                AI Assistant
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                Ask me anything about fishing regulations, weather, safety, or best practices. I'm here to help you have the best fishing experience.
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
              <Chatbot />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
