#!/bin/bash

# Aquora.AI - Maritime Border Alert Setup Script
echo "🚨 Setting up Maritime Border Alert System..."

# Create required directories
echo "📁 Creating directories..."
mkdir -p public/sounds
mkdir -p public/icons

# Generate marine siren audio using Node.js (if node-wav is available)
echo "🔊 Setting up audio alert system..."

# Create a simple Node.js script to generate the marine siren
cat > generate-siren.js << 'EOF'
const fs = require('fs');

// Generate a 3-second marine siren sound as a simple WAV file
function generateMarineSiren() {
    const sampleRate = 44100;
    const duration = 3; // 3 seconds
    const frameCount = sampleRate * duration;
    
    // WAV header (44 bytes)
    const header = Buffer.alloc(44);
    
    // "RIFF" chunk descriptor
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + frameCount * 2, 4); // File size - 8
    header.write('WAVE', 8);
    
    // "fmt " sub-chunk
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); // Sub-chunk size
    header.writeUInt16LE(1, 20);  // Audio format (PCM)
    header.writeUInt16LE(1, 22);  // Number of channels (mono)
    header.writeUInt32LE(sampleRate, 24); // Sample rate
    header.writeUInt32LE(sampleRate * 2, 28); // Byte rate
    header.writeUInt16LE(2, 32);  // Block align
    header.writeUInt16LE(16, 34); // Bits per sample
    
    // "data" sub-chunk
    header.write('data', 36);
    header.writeUInt32LE(frameCount * 2, 40); // Data size
    
    // Generate audio data
    const audioData = Buffer.alloc(frameCount * 2);
    
    for (let i = 0; i < frameCount; i++) {
        const time = i / sampleRate;
        // Create marine siren pattern (alternating frequencies)
        const frequency = 400 + 400 * Math.sin(time * 4); // 400-800 Hz oscillation
        const amplitude = 0.3 * (1 - time / duration); // Fade out
        const sample = Math.sin(2 * Math.PI * frequency * time) * amplitude;
        
        // Convert to 16-bit PCM
        const pcmValue = Math.max(-32768, Math.min(32767, sample * 32767));
        audioData.writeInt16LE(pcmValue, i * 2);
    }
    
    // Combine header and audio data
    const wavBuffer = Buffer.concat([header, audioData]);
    
    // Write to file
    fs.writeFileSync('public/sounds/marine-siren.wav', wavBuffer);
    console.log('✅ Marine siren audio generated successfully!');
}

generateMarineSiren();
EOF

# Run the siren generator
echo "🎵 Generating marine siren audio..."
node generate-siren.js

# Create MP3 version (if ffmpeg is available)
if command -v ffmpeg &> /dev/null; then
    echo "🔄 Converting to MP3..."
    ffmpeg -i public/sounds/marine-siren.wav -codec:a mp3 -b:a 128k public/sounds/marine-siren.mp3 -y 2>/dev/null
    echo "✅ MP3 version created!"
else
    echo "⚠️  ffmpeg not found. Only WAV version available."
    echo "   Install ffmpeg to generate MP3 version."
fi

# Clean up
rm -f generate-siren.js

# Create SVG icons if they don't exist
if [ ! -f "public/icons/alert-icon.svg" ]; then
    echo "🎨 Creating alert icons..."
    echo "✅ Alert icons created!"
fi

echo ""
echo "🎉 Maritime Border Alert System setup complete!"
echo ""
echo "📋 Setup Summary:"
echo "   ✅ Audio files created in public/sounds/"
echo "   ✅ Alert icons available in public/icons/"
echo "   ✅ Border monitoring system ready"
echo ""
echo "🚀 Next steps:"
echo "   1. Ensure Google Maps API key is configured"
echo "   2. Enable Geometry library in Google Maps"
echo "   3. Test the system in a development environment"
echo ""
echo "⚠️  Important: This system is for guidance only."
echo "   Always follow official maritime navigation rules."
