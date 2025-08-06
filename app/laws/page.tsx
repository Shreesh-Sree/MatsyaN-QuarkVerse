"use client";

import { FishingLawsChat } from "@/components/FishingLawsChat";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function LawsPage() {
  const features = [
    { text: "Legal Guidelines" },
    { text: "Regulations" },
    { text: "Compliance" },
  ];

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-custom-white dark:bg-black">
        <main className="flex-1 container mx-auto py-6 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-medium text-foreground dark:text-custom-white mb-2 font-claude">
                        Fishing Laws & Regulations
                    </h1>
                    <p className="text-muted-foreground dark:text-custom-secondary text-base font-claude mb-6">
                        Use our AI assistant to get clear, concise answers about fishing laws in your area.
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
                <div className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900 rounded-lg overflow-hidden">
                    <FishingLawsChat />
                </div>
            </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
