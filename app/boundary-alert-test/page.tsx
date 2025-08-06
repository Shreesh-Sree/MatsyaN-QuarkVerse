'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScreenFlashOverlay } from '@/components/ScreenFlashOverlay';
import { AlertTriangle, Volume2, Zap } from 'lucide-react';

export default function BoundaryAlertTest() {
  const [isFlashing, setIsFlashing] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [isContinuousFlashing, setIsContinuousFlashing] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const policeSirenRef = useRef<HTMLAudioElement | null>(null);
  const continuousFlashRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize audio elements
    audioRef.current = new Audio('/sounds/marine-siren.mp3');
    audioRef.current.preload = 'auto';
    
    policeSirenRef.current = new Audio('/sounds/police-siren.mp3');
    policeSirenRef.current.preload = 'auto';

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (policeSirenRef.current) {
        policeSirenRef.current.pause();
        policeSirenRef.current = null;
      }
      if (continuousFlashRef.current) {
        clearInterval(continuousFlashRef.current);
        continuousFlashRef.current = null;
      }
    };
  }, []);

  const testPoliceSiren = async () => {
    setIsPlayingSound(true);
    try {
      if (policeSirenRef.current) {
        policeSirenRef.current.currentTime = 0;
        policeSirenRef.current.volume = volume;
        console.log('🚨 Playing police siren at volume:', volume);
        await policeSirenRef.current.play();
      } else {
        const audio = new Audio('/sounds/police-siren.mp3');
        audio.volume = volume;
        audio.currentTime = 0;
        await audio.play();
      }
      
      // Stop playing indication after 3 seconds
      setTimeout(() => {
        setIsPlayingSound(false);
      }, 3000);
    } catch (error) {
      console.error('Could not play police siren:', error);
      setIsPlayingSound(false);
    }
  };

  const testMarineSiren = async () => {
    setIsPlayingSound(true);
    try {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.volume = volume;
        console.log('🔊 Playing marine siren at volume:', volume);
        await audioRef.current.play();
      } else {
        const audio = new Audio('/sounds/marine-siren.mp3');
        audio.volume = volume;
        audio.currentTime = 0;
        await audio.play();
      }
      
      // Stop playing indication after 3 seconds
      setTimeout(() => {
        setIsPlayingSound(false);
      }, 3000);
    } catch (error) {
      console.error('Could not play marine siren:', error);
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

  const testContinuousFlashing = () => {
    if (isContinuousFlashing) {
      // Stop continuous flashing
      if (continuousFlashRef.current) {
        clearInterval(continuousFlashRef.current);
        continuousFlashRef.current = null;
      }
      setIsContinuousFlashing(false);
      setIsFlashing(false);
      console.log('🛑 Stopped continuous flashing');
    } else {
      // Start continuous flashing (simulating user outside boundary)
      setIsContinuousFlashing(true);
      console.log('🚨 Starting continuous boundary violation flashing');
      
      continuousFlashRef.current = setInterval(() => {
        setIsFlashing(true);
        console.log('⚠️ Continuous flash triggered');
      }, 5000); // Flash every 5 seconds
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    // Update volume on existing audio elements
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (policeSirenRef.current) {
      policeSirenRef.current.volume = newVolume;
    }
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
              
              {/* Volume Control */}
              <Card className="border-2 border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-blue-600" />
                    Volume Control
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Adjust the volume for all audio alerts (Current: {Math.round(volume * 100)}%)
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">0%</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.1" 
                        value={volume}
                        onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                      />
                      <span className="text-sm text-gray-500">100%</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleVolumeChange(0.5)} 
                        variant="outline" 
                        size="sm"
                      >
                        50%
                      </Button>
                      <Button 
                        onClick={() => handleVolumeChange(0.8)} 
                        variant="outline" 
                        size="sm"
                      >
                        80%
                      </Button>
                      <Button 
                        onClick={() => handleVolumeChange(1.0)} 
                        variant="outline" 
                        size="sm"
                      >
                        Max
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

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

              {/* Marine Siren Test */}
              <Card className="border-2 border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-orange-600" />
                    Marine Siren Audio Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Click to test the marine siren sound that plays for general boundary warnings.
                  </p>
                  <Button 
                    onClick={testMarineSiren}
                    disabled={isPlayingSound}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isPlayingSound ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Playing Marine Siren...
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 mr-2" />
                        Test Marine Siren
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

              {/* Continuous Flashing Test */}
              <Card className="border-2 border-orange-200 dark:border-orange-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    Continuous Boundary Violation Alert
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Simulates the continuous screen flashing that occurs when a user remains outside the safe boundary.
                    Screen flashes every 5 seconds while the violation persists.
                  </p>
                  <Button 
                    onClick={testContinuousFlashing}
                    className={`${isContinuousFlashing 
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  >
                    {isContinuousFlashing ? (
                      <>
                        <div className="animate-pulse w-4 h-4 bg-white rounded-full mr-2"></div>
                        Stop Continuous Alert
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Start Continuous Flashing
                      </>
                    )}
                  </Button>
                  {isContinuousFlashing && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-bold animate-pulse">
                      ⚠️ Continuous boundary violation alert active - Screen will flash every 5 seconds
                    </p>
                  )}
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
                    <li>• <strong>Continuous Flashing:</strong> Screen flashes every 5 seconds while user remains outside safe boundary</li>
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
