"use client";

import { Chatbot } from "@/components/Chatbot";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ChatPage() {
  const features = [
    { text: "Safety Guidelines" },
    { text: "Fishing Regulations" },
    { text: "Weather Insights" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-custom-white dark:bg-black">
        <main className="flex-1 container mx-auto py-6 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-medium text-foreground dark:text-custom-white mb-2 font-['Inter']">
                AI Assistant
              </h1>
              <p className="text-muted-foreground dark:text-custom-secondary text-base font-['Inter'] mb-6">
                Ask me anything about fishing regulations, weather, safety, or best practices. I'm here to help you have the best fishing experience.
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
            
            <div className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900 rounded-lg overflow-hidden">
              <Chatbot />
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
