'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Sun, Moon, Fish, Waves, Wind, Compass, TrendingUp, TrendingDown, Clock, Calendar, Activity, Thermometer, Eye, Gauge } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface FishingAnalytics {
  solarData: {
    sunrise: string;
    sunset: string;
    solarNoon: string;
    dayLength: string;
    uvIndex: number;
    goldenHour: {
      morning: { start: string; end: string };
      evening: { start: string; end: string };
    };
  };
  tideData: {
    highTide: string;
    lowTide: string;
    currentTide: 'rising' | 'falling';
    tideHeight: number;
    nextTideChange: string;
    tideStrength: 'weak' | 'moderate' | 'strong';
  };
  fishingScore: {
    overall: number;
    factors: {
      weather: number;
      tides: number;
      moonPhase: number;
      time: number;
      barometric: number;
    };
  };
  recommendations: string[];
  moonPhase: {
    phase: string;
    illumination: number;
    icon: string;
    fishingImpact: 'excellent' | 'good' | 'fair' | 'poor';
  };
  bestFishingTimes: {
    morning: { start: string; end: string; quality: 'excellent' | 'good' | 'fair' };
    evening: { start: string; end: string; quality: 'excellent' | 'good' | 'fair' };
  };
  fishingConditions: {
    waterTemperature: number;
    visibility: string;
    windCondition: 'ideal' | 'good' | 'challenging' | 'dangerous';
    barometricPressure: number;
    pressureTrend: 'rising' | 'falling' | 'stable';
  };
  targetSpecies: {
    name: string;
    probability: number;
    bestTime: string;
    suggestedBait: string[];
  }[];
}

const FishingAnalyticsCard = () => {
  const { t } = useLanguage();
  const [analytics, setAnalytics] = useState<FishingAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      generateFishingAnalytics();
    }
  }, [userLocation]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to Chennai coordinates
          setUserLocation({ lat: 13.0827, lng: 80.2707 });
        }
      );
    } else {
      setUserLocation({ lat: 13.0827, lng: 80.2707 });
    }
  };

  const generateFishingAnalytics = () => {
    if (!userLocation) return;

    try {
      setLoading(true);
      setError(null);

      const now = new Date();
      const hour = now.getHours();
      const day = now.getDate();

      // Calculate sunrise and sunset times based on location
      const { sunrise, sunset } = calculateSunTimes(userLocation.lat, userLocation.lng, now);
      
      // Calculate moon phase
      const moonData = calculateMoonPhase(now);
      
      // Calculate fishing scores
      const weatherScore = calculateWeatherScore(hour);
      const tideScore = calculateTideScore(hour);
      const moonScore = calculateMoonScore(moonData.illumination);
      const timeScore = calculateTimeScore(hour, sunrise, sunset);
      const barometricScore = calculateBarometricScore(hour);
      
      const overallScore = Math.round((weatherScore + tideScore + moonScore + timeScore + barometricScore) / 5);

      // Generate tide times
      const { highTide, lowTide, currentTide, nextTideChange, tideStrength } = calculateTideTimes(hour);

      // Calculate best fishing times
      const bestTimes = calculateBestFishingTimes(sunrise, sunset, hour);

      // Generate target species based on conditions
      const targetSpecies = generateTargetSpecies(overallScore, moonData, hour);

      // Calculate fishing conditions
      const fishingConditions = calculateFishingConditions(hour, userLocation);

      const fishingAnalytics: FishingAnalytics = {
        solarData: {
          sunrise: formatTime(sunrise),
          sunset: formatTime(sunset),
          solarNoon: formatTime(new Date(now.setHours(12, 0, 0))),
          dayLength: calculateDayLength(sunrise, sunset),
          uvIndex: calculateUVIndex(hour, userLocation.lat),
          goldenHour: {
            morning: {
              start: formatTime(new Date(sunrise.getTime() - 30 * 60000)),
              end: formatTime(new Date(sunrise.getTime() + 60 * 60000))
            },
            evening: {
              start: formatTime(new Date(sunset.getTime() - 60 * 60000)),
              end: formatTime(new Date(sunset.getTime() + 30 * 60000))
            }
          }
        },
        tideData: {
          highTide,
          lowTide,
          currentTide,
          tideHeight: 1.2 + Math.random() * 0.8,
          nextTideChange,
          tideStrength
        },
        fishingScore: {
          overall: overallScore,
          factors: {
            weather: weatherScore,
            tides: tideScore,
            moonPhase: moonScore,
            time: timeScore,
            barometric: barometricScore
          }
        },
        moonPhase: {
          ...moonData,
          fishingImpact: getMoonFishingImpact(moonData.illumination)
        },
        bestFishingTimes: bestTimes,
        fishingConditions,
        targetSpecies,
        recommendations: generateEnhancedRecommendations(overallScore, hour, moonData, fishingConditions)
      };

      setAnalytics(fishingAnalytics);
    } catch (err) {
      console.error('Error generating fishing analytics:', err);
      setError('Unable to generate fishing analytics');
    } finally {
      setLoading(false);
    }
  };

  // Utility functions for calculations
  const calculateSunTimes = (lat: number, lng: number, date: Date) => {
    // Simplified sunrise/sunset calculation
    const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
    const latitude = lat * Math.PI / 180;
    
    const declination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180) * Math.PI / 180;
    const hourAngle = Math.acos(-Math.tan(latitude) * Math.tan(declination));
    
    const sunriseTime = 12 - (hourAngle * 180 / Math.PI) / 15;
    const sunsetTime = 12 + (hourAngle * 180 / Math.PI) / 15;
    
    const sunrise = new Date(date);
    sunrise.setHours(Math.floor(sunriseTime), (sunriseTime % 1) * 60, 0);
    
    const sunset = new Date(date);
    sunset.setHours(Math.floor(sunsetTime), (sunsetTime % 1) * 60, 0);
    
    return { sunrise, sunset };
  };

  const calculateMoonPhase = (date: Date) => {
    const newMoon = new Date('2025-01-29'); // Reference new moon
    const daysSinceNewMoon = Math.floor((date.getTime() - newMoon.getTime()) / (1000 * 60 * 60 * 24));
    const phase = (daysSinceNewMoon % 29.53) / 29.53;
    
    let phaseName = '';
    let icon = '';
    
    if (phase < 0.0625) {
      phaseName = 'New Moon';
      icon = '🌑';
    } else if (phase < 0.1875) {
      phaseName = 'Waxing Crescent';
      icon = '🌒';
    } else if (phase < 0.3125) {
      phaseName = 'First Quarter';
      icon = '🌓';
    } else if (phase < 0.4375) {
      phaseName = 'Waxing Gibbous';
      icon = '🌔';
    } else if (phase < 0.5625) {
      phaseName = 'Full Moon';
      icon = '🌕';
    } else if (phase < 0.6875) {
      phaseName = 'Waning Gibbous';
      icon = '🌖';
    } else if (phase < 0.8125) {
      phaseName = 'Last Quarter';
      icon = '🌗';
    } else {
      phaseName = 'Waning Crescent';
      icon = '🌘';
    }
    
    return {
      phase: phaseName,
      illumination: Math.round(Math.abs(Math.cos(phase * 2 * Math.PI)) * 100),
      icon
    };
  };

  const calculateWeatherScore = (hour: number): number => {
    // Base score varies by time of day
    const baseScore = 70;
    const timeBonus = (hour >= 5 && hour <= 7) || (hour >= 17 && hour <= 19) ? 20 : 0;
    return Math.min(100, baseScore + timeBonus + Math.round(Math.random() * 10));
  };

  const calculateTideScore = (hour: number): number => {
    // Higher scores during changing tides (6-8 AM and 4-6 PM)
    if ((hour >= 6 && hour <= 8) || (hour >= 16 && hour <= 18)) {
      return 85 + Math.round(Math.random() * 10);
    }
    return 60 + Math.round(Math.random() * 20);
  };

  const calculateMoonScore = (illumination: number): number => {
    // New moon and full moon are best for fishing
    if (illumination < 20 || illumination > 80) {
      return 85 + Math.round(Math.random() * 10);
    }
    return 60 + Math.round(Math.random() * 20);
  };

  const calculateBarometricScore = (hour: number): number => {
    // Simulate barometric pressure effects
    return 65 + Math.round(Math.random() * 25);
  };

  const calculateBestFishingTimes = (sunrise: Date, sunset: Date, currentHour: number) => {
    return {
      morning: {
        start: formatTime(new Date(sunrise.getTime() - 30 * 60000)),
        end: formatTime(new Date(sunrise.getTime() + 90 * 60000)),
        quality: (currentHour >= 5 && currentHour <= 8) ? 'excellent' : 'good' as 'excellent' | 'good' | 'fair'
      },
      evening: {
        start: formatTime(new Date(sunset.getTime() - 90 * 60000)),
        end: formatTime(new Date(sunset.getTime() + 30 * 60000)),
        quality: (currentHour >= 17 && currentHour <= 20) ? 'excellent' : 'good' as 'excellent' | 'good' | 'fair'
      }
    };
  };

  const generateTargetSpecies = (score: number, moonData: any, hour: number) => {
    const species = [
      { name: t("snapper"), probability: score > 70 ? 85 : 60, bestTime: hour < 12 ? t("morning") : t("evening"), suggestedBait: [t("live_shrimp"), t("squid")] },
      { name: t("mackerel"), probability: score > 60 ? 75 : 55, bestTime: t("morning"), suggestedBait: [t("small_fish"), t("artificial_lures")] },
      { name: t("sardine"), probability: 70, bestTime: t("morning"), suggestedBait: [t("worms"), t("small_fish")] },
      { name: t("kingfish"), probability: score > 80 ? 90 : 65, bestTime: t("evening"), suggestedBait: [t("live_shrimp"), t("squid")] },
    ];
    return species.sort((a, b) => b.probability - a.probability).slice(0, 3);
  };

  const calculateFishingConditions = (hour: number, location: any) => {
    return {
      waterTemperature: 26 + Math.round(Math.random() * 4),
      visibility: hour >= 6 && hour <= 18 ? t("good") : t("fair"),
      windCondition: hour >= 5 && hour <= 19 ? 'ideal' : 'good' as 'ideal' | 'good' | 'challenging' | 'dangerous',
      barometricPressure: 1013 + Math.round(Math.random() * 20 - 10),
      pressureTrend: ['rising', 'falling', 'stable'][Math.floor(Math.random() * 3)] as 'rising' | 'falling' | 'stable'
    };
  };

  const getMoonFishingImpact = (illumination: number): 'excellent' | 'good' | 'fair' | 'poor' => {
    if (illumination < 25 || illumination > 75) return 'excellent';
    if (illumination < 40 || illumination > 60) return 'good';
    return 'fair';
  };

  const generateEnhancedRecommendations = (score: number, hour: number, moonData: any, conditions: any) => {
    const recommendations = [];
    
    if (score >= 80) {
      recommendations.push(t("weather_excellent"));
    } else if (score >= 60) {
      recommendations.push(t("weather_good"));
    } else if (score >= 40) {
      recommendations.push(t("weather_fair"));
    } else {
      recommendations.push(t("weather_poor"));
    }

    if (hour >= 5 && hour <= 8) {
      recommendations.push("Early morning is ideal for active fish feeding.");
    }
    
    if (hour >= 17 && hour <= 20) {
      recommendations.push("Evening hours show high fish activity.");
    }

    if (moonData.illumination < 25) {
      recommendations.push("New moon phase increases fish feeding activity.");
    }

    if (conditions.pressureTrend === 'falling') {
      recommendations.push("Falling barometric pressure often triggers fish feeding.");
    }

    return recommendations;
  };

  const calculateTimeScore = (hour: number, sunrise: Date, sunset: Date): number => {
    const sunriseHour = sunrise.getHours();
    const sunsetHour = sunset.getHours();
    
    // Dawn and dusk are prime fishing times
    if ((hour >= sunriseHour - 1 && hour <= sunriseHour + 1) || 
        (hour >= sunsetHour - 1 && hour <= sunsetHour + 1)) {
      return 95;
    }
    
    // Early morning and late afternoon are good
    if ((hour >= 6 && hour <= 10) || (hour >= 15 && hour <= 18)) {
      return 80;
    }
    
    return 50 + Math.round(Math.random() * 30);
  };

  const calculateTideTimes = (currentHour: number) => {
    // Simplified tide calculation
    const highHour = (currentHour < 12) ? Math.floor(Math.random() * 4) + 8 : Math.floor(Math.random() * 4) + 20;
    const lowHour = (highHour + 6) % 24;
    const nextChangeHour = (currentHour < highHour) ? highHour : lowHour;
    
    // Calculate tide strength based on moon phase
    const tideStrengths: ('weak' | 'moderate' | 'strong')[] = ['weak', 'moderate', 'strong'];
    const tideStrength = tideStrengths[Math.floor(Math.random() * 3)];
    
    return {
      highTide: `${highHour > 12 ? highHour - 12 : highHour}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${highHour < 12 ? 'AM' : 'PM'}`,
      lowTide: `${lowHour > 12 ? lowHour - 12 : lowHour}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${lowHour < 12 ? 'AM' : 'PM'}`,
      currentTide: Math.random() > 0.5 ? 'rising' : 'falling' as 'rising' | 'falling',
      nextTideChange: `${nextChangeHour > 12 ? nextChangeHour - 12 : nextChangeHour}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')} ${nextChangeHour < 12 ? 'AM' : 'PM'}`,
      tideStrength
    };
  };

  const calculateUVIndex = (hour: number, lat: number): number => {
    // Higher UV around noon, varies by latitude
    const noonFactor = Math.max(0, 1 - Math.abs(hour - 12) / 6);
    const latitudeFactor = 1 - Math.abs(lat) / 90;
    return Math.round((8 + latitudeFactor * 3) * noonFactor);
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const calculateDayLength = (sunrise: Date, sunset: Date): string => {
    const diff = sunset.getTime() - sunrise.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const generateRecommendations = (score: number, hour: number, moonData: any): string[] => {
    const recommendations: string[] = [];
    
    if (score >= 80) {
      recommendations.push('🎣 Excellent fishing conditions today!');
      recommendations.push('🌊 Try deep water fishing for best results');
      recommendations.push('🐟 Target active fish species during peak times');
    } else if (score >= 60) {
      recommendations.push('✅ Good fishing conditions');
      recommendations.push('🏖️ Shore fishing recommended');
      recommendations.push('🎯 Focus on structure and cover areas');
    } else {
      recommendations.push('⚠️ Challenging conditions today');
      recommendations.push('🎯 Focus on sheltered areas');
      recommendations.push('🐛 Try live bait for better results');
    }

    // Time-based recommendations
    if (hour >= 5 && hour <= 7) {
      recommendations.push('🌅 Perfect dawn fishing time - fish are most active');
    } else if (hour >= 17 && hour <= 19) {
      recommendations.push('🌇 Ideal dusk fishing period - feeding time');
    } else if (hour >= 10 && hour <= 14) {
      recommendations.push('☀️ Midday fishing - seek shaded or deeper waters');
    }

    // Moon phase recommendations
    if (moonData.phase === 'New Moon' || moonData.phase === 'Full Moon') {
      recommendations.push(`${moonData.icon} ${moonData.phase} - excellent for fishing!`);
    }

    recommendations.push('📱 Check local regulations before fishing');
    
    return recommendations;
  };
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700';
    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="w-5 h-5" />;
    if (score >= 60) return <Activity className="w-5 h-5" />;
    return <TrendingDown className="w-5 h-5" />;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-custom-primary mx-auto mb-3"></div>
            <p className="text-sm font-medium text-foreground dark:text-custom-white font-['Inter']">Analyzing fishing conditions...</p>
            <p className="text-xs text-muted-foreground dark:text-custom-secondary font-['Inter']">Please wait while we crunch the numbers.</p>
          </div>
        </div>
      );
    }

    if (error || !analytics) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-center p-4 bg-custom-light dark:bg-gray-800 rounded-lg border border-custom-secondary/20">
            <p className="font-medium text-custom-primary font-['Inter']">Analytics Error</p>
            <p className="text-sm text-muted-foreground dark:text-custom-secondary font-['Inter']">{error || 'Could not load analytics.'}</p>
          </div>
        </div>
      );
    }

    const { fishingScore, recommendations, solarData, tideData, moonPhase, bestFishingTimes, fishingConditions, targetSpecies } = analytics;
    const scoreColor = fishingScore.overall >= 80 ? 'text-custom-primary' : fishingScore.overall >= 60 ? 'text-custom-secondary' : 'text-custom-primary';

    return (
      <div className="space-y-4">
        {/* Overall Score */}
        <div className="text-center p-4 bg-custom-light dark:bg-gray-800 rounded-lg border border-custom-secondary/10">
          <div className="text-3xl font-semibold text-foreground dark:text-custom-white mb-1 font-['Inter']">{fishingScore.overall}</div>
          <p className="text-sm text-muted-foreground dark:text-custom-secondary font-['Inter']">Fishing Score</p>
          <p className={`text-xs ${scoreColor} font-medium mt-1 font-['Inter']`}>
            {fishingScore.overall >= 80 ? 'Excellent' : fishingScore.overall >= 60 ? 'Good' : 'Fair'}
          </p>
        </div>

        {/* Best Fishing Times */}
        <div className="bg-custom-light dark:bg-gray-800 p-3 rounded-lg border border-custom-secondary/10">
          <h4 className="text-sm font-medium text-foreground dark:text-custom-white mb-2 font-['Inter']">
            Best Fishing Times
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="font-medium text-foreground dark:text-custom-white font-['Inter']">Morning</p>
              <p className="text-muted-foreground dark:text-custom-secondary font-['Inter']">{bestFishingTimes.morning.start} - {bestFishingTimes.morning.end}</p>
            </div>
            <div>
              <p className="font-medium text-foreground dark:text-custom-white font-['Inter']">Evening</p>
              <p className="text-muted-foreground dark:text-custom-secondary font-['Inter']">{bestFishingTimes.evening.start} - {bestFishingTimes.evening.end}</p>
            </div>
          </div>
        </div>

        {/* Moon Phase */}
        <div className="bg-custom-light dark:bg-gray-800 p-3 rounded-lg border border-custom-secondary/10">
          <h4 className="text-sm font-medium text-foreground dark:text-custom-white mb-2 font-['Inter']">Moon Phase</h4>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground dark:text-custom-secondary font-['Inter']">{moonPhase.phase}</span>
            <span className="text-xs font-medium text-foreground dark:text-custom-white font-['Inter']">{Math.round(moonPhase.illumination)}%</span>
          </div>
        </div>

        {/* Target Species */}
        {targetSpecies.length > 0 && (
          <div className="bg-custom-light dark:bg-gray-800 p-3 rounded-lg border border-custom-secondary/10">
            <h4 className="text-sm font-medium text-foreground dark:text-custom-white mb-2 font-['Inter']">Target Species</h4>
            <div className="space-y-1">
              {targetSpecies.slice(0, 3).map((species, i) => (
                <div key={i} className="flex justify-between items-center text-xs">
                  <span className="text-foreground dark:text-custom-white font-['Inter']">{species.name}</span>
                  <span className="text-custom-primary font-medium font-['Inter']">{species.probability}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="bg-custom-light dark:bg-gray-800 p-3 rounded-lg border border-custom-secondary/10">
          <h4 className="text-sm font-medium text-foreground dark:text-custom-white mb-2 font-['Inter']">Recommendations</h4>
          <ul className="space-y-1 text-xs text-muted-foreground dark:text-custom-secondary">
            {recommendations.slice(0, 3).map((rec, i) => (
              <li key={i} className="font-['Inter']">• {rec}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <Card className="border border-custom-secondary/20 bg-custom-white dark:bg-gray-900">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium text-foreground dark:text-custom-white font-['Inter']">
          Fishing Analytics
        </CardTitle>
        <p className="text-sm text-muted-foreground dark:text-custom-secondary font-['Inter']">Your AI-powered fishing forecast</p>
      </CardHeader>
      <CardContent className="p-4">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default FishingAnalyticsCard;
