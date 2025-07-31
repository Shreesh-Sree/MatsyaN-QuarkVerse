import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage } = await request.json();

    if (!text || !targetLanguage) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      );
    }

    // Check if we have a Google Translate API key
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (apiKey) {
      // Use Google Translate API
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            target: targetLanguage,
            format: 'text',
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const translatedText = data.data.translations[0].translatedText;
        
        return NextResponse.json({
          translatedText,
          sourceLanguage: data.data.translations[0].detectedSourceLanguage,
          targetLanguage,
        });
      } else {
        throw new Error('Google Translate API request failed');
      }
    } else {
      // Fallback: Use a simple translation service or return a message
      // For now, we'll return a message indicating that translation requires an API key
      return NextResponse.json({
        translatedText: `${text} (Translation requires API key)`,
        message: 'To enable full translation, please add GOOGLE_TRANSLATE_API_KEY to your environment variables.',
        targetLanguage,
      });
    }
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
} 