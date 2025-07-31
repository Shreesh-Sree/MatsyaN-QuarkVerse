"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Languages, Globe, Loader2, Copy, Check } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface GoogleTranslateProps {
  text: string;
  targetLanguage?: string;
  className?: string;
}

const supportedLanguages = [
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰' },
  { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
  { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
  { code: 'my', name: 'မြန်မာ', flag: '🇲🇲' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
  { code: 'et', name: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
  { code: 'mt', name: 'Malti', flag: '🇲🇹' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
];

export function GoogleTranslate({ text, targetLanguage = 'en', className = '' }: GoogleTranslateProps) {
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(targetLanguage);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  // Google Translate API function (requires API key)
  const translateWithAPI = async (text: string, targetLang: string) => {
    try {
      // This would require a Google Cloud API key
      // For now, we'll use a fallback method
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage: targetLang,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.translatedText;
      } else {
        throw new Error('Translation failed');
      }
    } catch (error) {
      console.error('Translation error:', error);
      return null;
    }
  };

  // Fallback translation using Google Translate widget
  const translateWithFallback = async (text: string, targetLang: string) => {
    return new Promise<string>((resolve) => {
      // Create a temporary element to use Google Translate
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = text;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      document.body.appendChild(tempDiv);

      // Use Google Translate widget if available
      if (window.google && window.google.translate) {
        window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: targetLang,
          autoDisplay: false,
        }, tempDiv, () => {
          setTimeout(() => {
            const translated = tempDiv.innerHTML;
            document.body.removeChild(tempDiv);
            resolve(translated);
          }, 1000);
        });
      } else {
        // Fallback: return original text with a note
        document.body.removeChild(tempDiv);
        resolve(`${text} (Translation not available)`);
      }
    });
  };

  const handleTranslate = async () => {
    if (!text.trim()) return;

    setIsTranslating(true);
    setCopied(false);

    try {
      // Try API first, then fallback
      let result = await translateWithAPI(text, selectedLanguage);
      
      if (!result) {
        result = await translateWithFallback(text, selectedLanguage);
      }

      setTranslatedText(result);
    } catch (error) {
      console.error('Translation failed:', error);
      setTranslatedText('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(translatedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    setShowLanguageSelector(false);
    setTranslatedText(''); // Clear previous translation
  };

  useEffect(() => {
    if (text && selectedLanguage !== 'en') {
      handleTranslate();
    }
  }, [text, selectedLanguage]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Language Selector */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowLanguageSelector(!showLanguageSelector)}
          className="flex items-center gap-2"
        >
          <Globe className="w-4 h-4" />
          {supportedLanguages.find(lang => lang.code === selectedLanguage)?.flag || '🌐'}
          {supportedLanguages.find(lang => lang.code === selectedLanguage)?.name || 'Select Language'}
        </Button>
        
        {showLanguageSelector && (
          <Card className="absolute z-50 mt-2 max-h-60 overflow-y-auto">
            <CardContent className="p-2">
              <div className="grid grid-cols-1 gap-1">
                {supportedLanguages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLanguageChange(lang.code)}
                    className="justify-start text-sm"
                  >
                    <span className="mr-2">{lang.flag}</span>
                    {lang.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Original Text */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Original Text
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{text}</p>
        </CardContent>
      </Card>

      {/* Translation */}
      {selectedLanguage !== 'en' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Translation ({supportedLanguages.find(lang => lang.code === selectedLanguage)?.name})
              </div>
              {translatedText && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-6 w-6 p-0"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isTranslating ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Translating...
              </div>
            ) : translatedText ? (
              <p className="text-sm">{translatedText}</p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click translate to get started
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Translate Button */}
      {selectedLanguage !== 'en' && !isTranslating && !translatedText && (
        <Button
          onClick={handleTranslate}
          className="w-full"
          disabled={!text.trim()}
        >
          <Languages className="w-4 h-4 mr-2" />
          Translate
        </Button>
      )}
    </div>
  );
}

// Add Google Translate script to the page
export function GoogleTranslateScript() {
  useEffect(() => {
    // Add Google Translate script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    // Initialize Google Translate
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ta,hi,bn,te,ml,kn,gu,pa,mr,or,as,ur,ne,si,my,th,vi,id,ms,zh,ja,ko,ar,fa,tr,ru,de,fr,es,pt,it,nl,pl,sv,da,no,fi,cs,hu,ro,bg,hr,sk,sl,et,lv,lt,mt,el,he',
        autoDisplay: false,
      }, 'google_translate_element');
    };

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return <div id="google_translate_element"></div>;
}

// Extend window object for Google Translate
declare global {
  interface Window {
    google: {
      translate: {
        TranslateElement: any;
      };
    };
    googleTranslateElementInit: () => void;
  }
} 