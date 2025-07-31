
# FisherMate.AI - Your Intelligent Fishing Companion

A comprehensive fishing application built with Next.js, featuring AI-powered assistance, real-time weather data, safety guidelines, and multi-language translation support.

## 🌟 Features

### Core Features
- **AI-Powered Dashboard** - Personalized fishing insights and analytics
- **Interactive Map** - Real-time location tracking and fishing spot discovery
- **Weather Analytics** - Advanced weather forecasting and fishing predictions
- **Safety Guidelines** - Comprehensive safety information and emergency procedures
- **Fishing Laws Assistant** - AI-powered legal guidance for fishing regulations
- **Voice Assistant** - Hands-free navigation and commands
- **Emergency SOS** - Quick emergency alerts with location sharing

### 🗣️ Multi-Language Translation
- **Universal Translator** - Translate any text into 50+ languages
- **Global Communication** - Connect with fishing communities worldwide
- **Real-time Translation** - Powered by Google Translate API
- **Copy to Clipboard** - Easy sharing of translated content
- **Sample Fishing Texts** - Pre-loaded common fishing phrases

### Supported Languages
- **Indian Languages**: Tamil, Hindi, Bengali, Telugu, Malayalam, Kannada, Gujarati, Punjabi, Marathi, Odia, Assamese, Urdu
- **Asian Languages**: Nepali, Sinhala, Burmese, Thai, Vietnamese, Indonesian, Malay, Chinese, Japanese, Korean
- **Middle Eastern**: Arabic, Persian, Turkish
- **European**: Russian, German, French, Spanish, Portuguese, Italian, Dutch, Polish, Swedish, Danish, Norwegian, Finnish, Czech, Hungarian, Romanian, Bulgarian, Croatian, Slovak, Slovenian, Estonian, Latvian, Lithuanian, Maltese, Greek, Hebrew

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Cloud account (optional, for translation API)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/fishermate-ai.git
   cd fishermate-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure environment variables**
   ```env
   # Required
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # Optional - Google Translate API (for enhanced translation)
   GOOGLE_TRANSLATE_API_KEY=your_google_translate_api_key_here
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Translation Setup

### Option 1: Free Translation (No API Key Required)
The application includes a fallback translation system that works without any API keys. Users can translate text using the built-in Google Translate widget.

### Option 2: Enhanced Translation (API Key Required)
For better translation quality and reliability:

1. **Get a Google Cloud API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Enable the "Cloud Translation API"
   - Create credentials (API Key)
   - Add the API key to your `.env.local` file

2. **Environment Variable**:
   ```env
   GOOGLE_TRANSLATE_API_KEY=your_api_key_here
   ```

## 🎨 Design System

### Color Palette
The application uses a Firebase/Google-inspired color scheme:

- **Firebase Yellow**: `#FFC400`
- **Firebase Orange**: `#FF9100` 
- **Firebase Red**: `#DD2C00`
- **Android Green**: `#C6FF00`
- **Gemini Pink**: `#FDADEE`
- **Google Blue**: `#4285F4`
- **Google Green**: `#34A853`

### Icons
- Uses **Lucide React** icons throughout the application
- **Favicon.ico** used for brand identity and logo
- Consistent icon sizing and styling across all components

## 📱 Features in Detail

### Translation System
- **50+ Languages**: Support for major world languages
- **Real-time Translation**: Instant translation with Google Translate
- **Copy to Clipboard**: Easy sharing of translated content
- **Sample Texts**: Pre-loaded fishing-related phrases
- **Language Detection**: Automatic source language detection
- **Fallback System**: Works without API key using Google Translate widget

### Navigation
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes
- **Language Switching**: English and Tamil support
- **PWA Support**: Installable as a progressive web app

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Translation**: Google Translate API + Widget
- **State Management**: React Context API
- **Authentication**: Firebase Auth
- **Database**: Local storage with offline support
- **Maps**: Google Maps integration
- **Weather**: OpenWeatherMap API

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@fishermate.ai or join our Discord community.

## 🔄 Updates

- **v1.0.0**: Initial release with core fishing features
- **v1.1.0**: Added multi-language translation support
- **v1.2.0**: Enhanced UI with Firebase/Google color scheme
- **v1.3.0**: Improved translation system with 50+ languages

---

**FisherMate.AI** - Making fishing smarter, safer, and more accessible worldwide! 🎣
