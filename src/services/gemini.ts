"use client";

import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with better error handling
const getApiKey = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey || apiKey === '') {
    console.error('NEXT_PUBLIC_GEMINI_API_KEY is not configured');
    throw new Error('Gemini API key is not configured. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.');
  }
  return apiKey;
};

let genAI: GoogleGenerativeAI;
try {
  genAI = new GoogleGenerativeAI(getApiKey());
} catch (error) {
  console.error('Failed to initialize Gemini AI:', error);
}

export interface FishingLawQuery {
  query: string;
  state: string;
  country?: string;
}

export interface SafetyQuery {
  query: string;
  weatherConditions?: string;
  fishingType?: string;
  location?: string;
}

export interface FishingDataEntry {
  id?: string;
  userId: string;
  date: string;
  location: {
    lat: number;
    lng: number;
    name: string;
  };
  species: string[];
  catch: {
    count: number;
    totalWeight: number;
    averageSize: number;
  };
  weatherConditions: {
    temperature: number;
    windSpeed: number;
    visibility: number;
    waveHeight: number;
  };
  equipment: string[];
  duration: number; // in hours
  success: boolean;
  notes: string;
  photos?: string[];
  createdAt: string;
  updatedAt: string;
}

export class GeminiService {
  private model;

  constructor() {
    if (!genAI) {
      throw new Error('Gemini AI is not properly initialized. Please check your API key configuration.');
    }
    try {
      this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } catch (error) {
      console.error('Failed to get Gemini model:', error);
      throw new Error('Failed to initialize Gemini model. Please check your API key and try again.');
    }
  }

  async getFishingLaws(query: FishingLawQuery): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini model is not initialized. Please check your API configuration.');
    }

    try {
      console.log('Requesting fishing laws for:', query);
      
      const prompt = `
        You are a fishing law expert specializing in regulations for ${query.state}, ${query.country || 'India'}. 
        
        User Question: ${query.query}
        
        Please provide comprehensive, accurate, and up-to-date information about fishing laws and regulations relevant to this query. Include:
        
        1. Specific regulations and restrictions
        2. Required licenses and permits
        3. Seasonal restrictions and protected periods
        4. Catch limits and size restrictions
        5. Equipment and method restrictions
        6. Protected areas and no-fishing zones
        7. Penalties for violations
        8. Contact information for local fisheries authorities
        
        Format your response in a clear, structured manner with bullet points and sections.
        Always emphasize the importance of checking with local authorities for the most current regulations.
        
        Focus specifically on ${query.state} regulations while also mentioning relevant national laws.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      if (!text || text.trim() === '') {
        throw new Error('Empty response from Gemini API');
      }
      
      console.log('Successfully received fishing laws response');
      return text;
    } catch (error) {
      console.error('Error getting fishing laws:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API_KEY')) {
          throw new Error('Invalid API key. Please check your Gemini API key configuration.');
        } else if (error.message.includes('quota')) {
          throw new Error('API quota exceeded. Please try again later or check your API usage.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        throw new Error(`Failed to retrieve fishing law information: ${error.message}`);
      }
      
      throw new Error('Failed to retrieve fishing law information. Please try again.');
    }
  }

  async getSafetyGuidelines(query: SafetyQuery): Promise<string> {
    try {
      const prompt = `
        You are a marine safety expert specializing in fishing safety practices and emergency procedures.
        
        User Question: ${query.query}
        ${query.weatherConditions ? `Weather Conditions: ${query.weatherConditions}` : ''}
        ${query.fishingType ? `Fishing Type: ${query.fishingType}` : ''}
        ${query.location ? `Location: ${query.location}` : ''}
        
        Please provide comprehensive safety guidelines and best practices including:
        
        1. Pre-trip safety preparations and equipment checklist
        2. Weather assessment and risk evaluation
        3. Emergency procedures and communication protocols
        4. Personal protective equipment (PPE) requirements
        5. Boat safety and navigation guidelines
        6. First aid procedures for common fishing injuries
        7. Environmental hazard awareness
        8. Emergency contact information and distress signals
        9. Post-trip safety protocols
        
        Format your response with clear sections, bullet points, and actionable advice.
        Emphasize critical safety measures and highlight emergency procedures.
        Include specific recommendations based on the fishing conditions mentioned.
        
        Always prioritize safety over fishing success and remind users to inform others of their fishing plans.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting safety guidelines:', error);
      throw new Error('Failed to retrieve safety information');
    }
  }

  async generateFishingInsights(fishingData: FishingDataEntry[]): Promise<string> {
    try {
      const dataAnalysis = this.analyzeFishingData(fishingData);
      
      const prompt = `
        As a fishing analytics expert, analyze the following fishing data and provide insights:
        
        ${JSON.stringify(dataAnalysis, null, 2)}
        
        Provide insights including:
        1. Most successful fishing times and conditions
        2. Best performing locations and species
        3. Equipment effectiveness analysis
        4. Weather pattern correlations
        5. Seasonal trends and recommendations
        6. Areas for improvement
        7. Personalized fishing tips based on historical performance
        
        Format as a comprehensive but concise analysis with actionable recommendations.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating fishing insights:', error);
      throw new Error('Failed to generate fishing insights');
    }
  }

  private analyzeFishingData(data: FishingDataEntry[]) {
    const analysis = {
      totalTrips: data.length,
      successRate: data.filter(trip => trip.success).length / data.length,
      averageCatch: data.reduce((sum, trip) => sum + trip.catch.count, 0) / data.length,
      averageDuration: data.reduce((sum, trip) => sum + trip.duration, 0) / data.length,
      commonSpecies: this.getMostCommon(data.flatMap(trip => trip.species)),
      bestLocations: this.getMostSuccessful(data),
      weatherPatterns: this.analyzeWeatherPatterns(data),
      equipmentUsage: this.getMostCommon(data.flatMap(trip => trip.equipment)),
    };
    
    return analysis;
  }

  private getMostCommon(items: string[]): { [key: string]: number } {
    return items.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
  }

  private getMostSuccessful(data: FishingDataEntry[]) {
    const locationSuccess = data.reduce((acc, trip) => {
      const location = trip.location.name;
      if (!acc[location]) {
        acc[location] = { total: 0, successful: 0 };
      }
      acc[location].total++;
      if (trip.success) acc[location].successful++;
      return acc;
    }, {} as { [key: string]: { total: number; successful: number } });

    return Object.entries(locationSuccess)
      .map(([location, stats]) => ({
        location,
        successRate: stats.successful / stats.total,
        totalTrips: stats.total
      }))
      .sort((a, b) => b.successRate - a.successRate);
  }

  private analyzeWeatherPatterns(data: FishingDataEntry[]) {
    const successfulTrips = data.filter(trip => trip.success);
    const unsuccessfulTrips = data.filter(trip => !trip.success);

    return {
      successfulConditions: {
        avgTemperature: successfulTrips.reduce((sum, trip) => sum + trip.weatherConditions.temperature, 0) / successfulTrips.length,
        avgWindSpeed: successfulTrips.reduce((sum, trip) => sum + trip.weatherConditions.windSpeed, 0) / successfulTrips.length,
        avgVisibility: successfulTrips.reduce((sum, trip) => sum + trip.weatherConditions.visibility, 0) / successfulTrips.length,
      },
      unsuccessfulConditions: {
        avgTemperature: unsuccessfulTrips.reduce((sum, trip) => sum + trip.weatherConditions.temperature, 0) / unsuccessfulTrips.length,
        avgWindSpeed: unsuccessfulTrips.reduce((sum, trip) => sum + trip.weatherConditions.windSpeed, 0) / unsuccessfulTrips.length,
        avgVisibility: unsuccessfulTrips.reduce((sum, trip) => sum + trip.weatherConditions.visibility, 0) / unsuccessfulTrips.length,
      }
    };
  }
}

export const geminiService = new GeminiService();
