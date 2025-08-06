import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const getApiKey = () => {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey || apiKey === '') {
    throw new Error('Gemini API key is not configured');
  }
  return apiKey;
};

const genAI = new GoogleGenerativeAI(getApiKey());

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fishingData } = body;

    if (!fishingData || !Array.isArray(fishingData)) {
      return NextResponse.json(
        { error: 'Invalid fishing data provided' },
        { status: 400 }
      );
    }

    console.log('API Route: Received fishing data with', fishingData.length, 'entries');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Analyze the data
    const dataAnalysis = analyzeFishingData(fishingData);
    console.log('API Route: Data analysis complete');

    const prompt = `
      As an expert fishing consultant and data analyst, analyze the following fishing data and provide personalized, actionable insights:
      
      FISHING DATA SUMMARY:
      ${JSON.stringify(dataAnalysis, null, 2)}
      
      DETAILED TRIP DATA:
      ${fishingData.map((trip: any) => `
      Date: ${trip.date}
      Location: ${trip.location.name}
      Species: ${trip.species.join(', ')}
      Catches: ${trip.catch.count} fish, ${trip.catch.totalWeight} lbs
      Duration: ${trip.duration} hours
      Success: ${trip.success ? 'Yes' : 'No'}
      Notes: ${trip.notes || 'No notes'}
      `).join('\n')}
      
      Please provide a comprehensive analysis with:
      
      1. **SUCCESS PATTERNS**: What patterns lead to successful fishing trips?
      2. **LOCATION ANALYSIS**: Which locations perform best and why?
      3. **SPECIES INSIGHTS**: Best times and methods for target species
      4. **TIMING RECOMMENDATIONS**: Optimal fishing times based on historical data
      5. **IMPROVEMENT STRATEGIES**: Specific actions to increase success rate
      6. **SEASONAL TRENDS**: What patterns emerge from the timing of trips?
      7. **PERSONALIZED TIPS**: Custom recommendations based on fishing style
      
      Format your response with clear headings, bullet points, and actionable advice.
      Be specific and practical - focus on what the angler can do differently.
      If there's limited data, acknowledge it and suggest what additional information would be helpful.
      
      Keep the tone encouraging and educational.
    `;

    console.log('API Route: Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('API Route: Received response from Gemini, length:', text.length);

    return NextResponse.json({ insights: text });
  } catch (error) {
    console.error('API Route Error:', error);
    
    let errorMessage = 'Failed to generate insights';
    if (error instanceof Error) {
      if (error.message.includes('API_KEY') || error.message.includes('key')) {
        errorMessage = 'API key configuration error';
      } else if (error.message.includes('quota')) {
        errorMessage = 'API quota exceeded';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network connection error';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

function analyzeFishingData(data: any[]) {
  const analysis = {
    totalTrips: data.length,
    successRate: data.filter(trip => trip.success).length / data.length,
    averageCatch: data.reduce((sum, trip) => sum + trip.catch.count, 0) / data.length,
    averageDuration: data.reduce((sum, trip) => sum + trip.duration, 0) / data.length,
    commonSpecies: getMostCommon(data.flatMap(trip => trip.species)),
    bestLocations: getMostSuccessful(data),
  };
  
  return analysis;
}

function getMostCommon(items: string[]): { [key: string]: number } {
  return items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });
}

function getMostSuccessful(data: any[]) {
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
      successRate: (stats as { total: number; successful: number }).successful / (stats as { total: number; successful: number }).total,
      totalTrips: (stats as { total: number; successful: number }).total
    }))
    .sort((a, b) => b.successRate - a.successRate);
}
