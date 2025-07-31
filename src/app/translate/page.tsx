"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { GoogleTranslate, GoogleTranslateScript } from '@/components/GoogleTranslate';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Languages, Globe, ArrowRight, Copy, Check } from 'lucide-react';

export default function TranslatePage() {
  const [inputText, setInputText] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);

  const sampleTexts = [
    "Welcome to FisherMate.AI - Your intelligent fishing companion for safer, smarter, and more successful trips on the water.",
    "Check the weather conditions before going fishing. Always wear a life jacket and carry emergency equipment.",
    "Fishing regulations vary by location. Make sure to check local laws and obtain necessary permits.",
    "The best time to fish is usually early morning or late evening when fish are most active.",
    "Remember to practice catch and release to help preserve fish populations for future generations."
  ];

  const handleSampleText = (text: string) => {
    setInputText(text);
    setShowTranslation(true);
  };

  const handleTranslate = () => {
    if (inputText.trim()) {
      setShowTranslation(true);
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen bg-background text-foreground">
        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-google-blue/10 border border-google-blue/20 text-google-blue text-sm font-medium mb-6">
                <Globe className="w-4 h-4" />
                Multi-Language Translation
              </div>
              <div className="inline-block bg-google-blue/10 p-4 rounded-2xl mb-6 border border-google-blue/20">
                <Languages className="w-12 h-12 text-google-blue" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
                Universal Translator
              </h1>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
                Translate any text into multiple languages. Perfect for communicating with fishing communities worldwide.
              </p>
            </div>

            {/* Main Translation Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Languages className="w-5 h-5" />
                      Enter Text to Translate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Enter any text you want to translate..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      className="min-h-[200px] resize-none"
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={handleTranslate}
                        disabled={!inputText.trim()}
                        className="flex-1"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Translate
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => setInputText('')}
                        disabled={!inputText}
                      >
                        Clear
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Sample Texts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sample Fishing Texts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {sampleTexts.map((text, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          onClick={() => handleSampleText(text)}
                          className="w-full justify-start text-left h-auto p-3"
                        >
                          <div className="flex items-start gap-2">
                            <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="text-sm line-clamp-2">{text}</span>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Translation Section */}
              <div className="space-y-6">
                {showTranslation && inputText.trim() && (
                  <GoogleTranslate 
                    text={inputText}
                    className="w-full"
                  />
                )}

                {/* Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Translation Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-google-green/10 flex items-center justify-center">
                          <Globe className="w-4 h-4 text-google-green" />
                        </div>
                        <div>
                          <h4 className="font-medium">50+ Languages</h4>
                          <p className="text-sm text-muted-foreground">Support for major world languages</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-firebase-orange/10 flex items-center justify-center">
                          <Copy className="w-4 h-4 text-firebase-orange" />
                        </div>
                        <div>
                          <h4 className="font-medium">Copy to Clipboard</h4>
                          <p className="text-sm text-muted-foreground">Easy copying of translated text</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gemini-pink/10 flex items-center justify-center">
                          <Check className="w-4 h-4 text-gemini-pink" />
                        </div>
                        <div>
                          <h4 className="font-medium">High Accuracy</h4>
                          <p className="text-sm text-muted-foreground">Powered by Google Translate</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Language Support */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Supported Languages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>🇮🇳 தமிழ் (Tamil)</div>
                      <div>🇮🇳 हिंदी (Hindi)</div>
                      <div>🇧🇩 বাংলা (Bengali)</div>
                      <div>🇮🇳 తెలుగు (Telugu)</div>
                      <div>🇮🇳 മലയാളം (Malayalam)</div>
                      <div>🇮🇳 ಕನ್ನಡ (Kannada)</div>
                      <div>🇮🇳 ગુજરાતી (Gujarati)</div>
                      <div>🇮🇳 ਪੰਜਾਬੀ (Punjabi)</div>
                      <div>🇮🇳 मराठी (Marathi)</div>
                      <div>🇮🇳 ଓଡ଼ିଆ (Odia)</div>
                      <div>🇮🇳 অসমীয়া (Assamese)</div>
                      <div>🇵🇰 اردو (Urdu)</div>
                      <div>🇳🇵 नेपाली (Nepali)</div>
                      <div>🇱🇰 සිංහල (Sinhala)</div>
                      <div>🇲🇲 မြန်မာ (Burmese)</div>
                      <div>🇹🇭 ไทย (Thai)</div>
                      <div>🇻🇳 Tiếng Việt (Vietnamese)</div>
                      <div>🇮🇩 Bahasa Indonesia</div>
                      <div>🇲🇾 Bahasa Melayu (Malay)</div>
                      <div>🇨🇳 中文 (Chinese)</div>
                      <div>🇯🇵 日本語 (Japanese)</div>
                      <div>🇰🇷 한국어 (Korean)</div>
                      <div>🇸🇦 العربية (Arabic)</div>
                      <div>🇮🇷 فارسی (Persian)</div>
                      <div>🇹🇷 Türkçe (Turkish)</div>
                      <div>🇷🇺 Русский (Russian)</div>
                      <div>🇩🇪 Deutsch (German)</div>
                      <div>🇫🇷 Français (French)</div>
                      <div>🇪🇸 Español (Spanish)</div>
                      <div>🇵🇹 Português (Portuguese)</div>
                      <div>🇮🇹 Italiano (Italian)</div>
                      <div>🇳🇱 Nederlands (Dutch)</div>
                      <div>🇵🇱 Polski (Polish)</div>
                      <div>🇸🇪 Svenska (Swedish)</div>
                      <div>🇩🇰 Dansk (Danish)</div>
                      <div>🇳🇴 Norsk (Norwegian)</div>
                      <div>🇫🇮 Suomi (Finnish)</div>
                      <div>🇨🇿 Čeština (Czech)</div>
                      <div>🇭🇺 Magyar (Hungarian)</div>
                      <div>🇷🇴 Română (Romanian)</div>
                      <div>🇧🇬 Български (Bulgarian)</div>
                      <div>🇭🇷 Hrvatski (Croatian)</div>
                      <div>🇸🇰 Slovenčina (Slovak)</div>
                      <div>🇸🇮 Slovenščina (Slovenian)</div>
                      <div>🇪🇪 Eesti (Estonian)</div>
                      <div>🇱🇻 Latviešu (Latvian)</div>
                      <div>🇱🇹 Lietuvių (Lithuanian)</div>
                      <div>🇲🇹 Malti (Maltese)</div>
                      <div>🇬🇷 Ελληνικά (Greek)</div>
                      <div>🇮🇱 עברית (Hebrew)</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        {/* Google Translate Script */}
        <GoogleTranslateScript />
      </div>
    </ProtectedRoute>
  );
} 