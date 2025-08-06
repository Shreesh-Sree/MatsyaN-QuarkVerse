'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScreenFlashOverlay } from '@/components/ScreenFlashOverlay';
import { AlertTriangle, Volume2, Zap } from 'lucide-react';

export default function BoundaryAlertTest() {
  const [isFlashing, setIsFlashing] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const testPoliceSiren = async () => {
    setIsPlayingSound(true);
    try {
      const audio = new Audio('/sounds/police-siren.mp3');
      audio.currentTime = 0;
      await audio.play();
      
      // Stop playing indication after 3 seconds
      setTimeout(() => {
        setIsPlayingSound(false);
      }, 3000);
    } catch (error) {
      console.error('Could not play police siren:', error);
      setIsPlayingSound(false);
    }
  };

  const testScreenFlash = () => {
    setIsFlashing(true);
  };

  const testBothAlerts = async () => {
    setIsFlashing(true);
    await testPoliceSiren();
  };

  const handleFlashComplete = () => {
    setIsFlashing(false);
  };

  return (
    <>
      {/* Screen Flash Overlay */}
      <ScreenFlashOverlay 
        isFlashing={isFlashing}
        flashColor="#FF0000"
        duration={3000}
        intensity={0.7}
        onFlashComplete={handleFlashComplete}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                Boundary Alert System Test
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Test the police siren sound and screen flash alerts for fishing boundary violations.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Police Siren Test */}
              <Card className="border-2 border-red-200 dark:border-red-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-red-600" />
                    Police Siren Audio Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Click to test the police siren sound that plays when fishermen cross into restricted waters.
                  </p>
                  <Button 
                    onClick={testPoliceSiren}
                    disabled={isPlayingSound}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isPlayingSound ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Playing Police Siren...
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 mr-2" />
                        Test Police Siren
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Screen Flash Test */}
              <Card className="border-2 border-yellow-200 dark:border-yellow-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-600" />
                    Screen Flash Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Click to test the red screen flash effect that activates during boundary violations.
                  </p>
                  <Button 
                    onClick={testScreenFlash}
                    disabled={isFlashing}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    {isFlashing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Flashing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Test Screen Flash
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Combined Alert Test */}
              <Card className="border-2 border-purple-200 dark:border-purple-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-purple-600" />
                    Full Boundary Alert Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Click to test the complete boundary violation alert: police siren + screen flash.
                    This simulates what happens when a fisherman crosses into restricted waters.
                  </p>
                  <Button 
                    onClick={testBothAlerts}
                    disabled={isFlashing || isPlayingSound}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {(isFlashing || isPlayingSound) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Alert Active...
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Test Full Alert System
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Information Card */}
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    🛡️ How It Works
                  </h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• <strong>Police Siren:</strong> Plays when fishermen cross into restricted or international waters</li>
                    <li>• <strong>Screen Flash:</strong> Red overlay flashes rapidly to get immediate attention</li>
                    <li>• <strong>Combined Alert:</strong> Maximum impact warning for critical boundary violations</li>
                    <li>• <strong>Real-world Usage:</strong> Integrated with GPS tracking in the fishing border monitor</li>
                  </ul>
                </CardContent>
              </Card>

            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
