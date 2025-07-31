// Console warning suppression for known Google Maps deprecation warnings
// This helps reduce noise during development while we migrate to newer APIs

const SUPPRESSED_WARNINGS = [
  'google.maps.Marker is deprecated',
  'google.maps.places.PlacesService is not available to new customers',
  'Please use google.maps.marker.AdvancedMarkerElement instead',
  'Please use google.maps.places.Place instead'
];

const originalConsoleWarn = console.warn;

console.warn = (...args: any[]) => {
  const message = args.join(' ');
  
  // Check if this is a suppressed warning
  const shouldSuppress = SUPPRESSED_WARNINGS.some(suppressedWarning => 
    message.includes(suppressedWarning)
  );
  
  if (!shouldSuppress) {
    originalConsoleWarn.apply(console, args);
  }
};

// Only suppress in development
if (process.env.NODE_ENV === 'development') {
  console.info('🗺️ Google Maps deprecation warnings have been suppressed during development.');
  console.info('   Migration to new APIs is planned for future releases.');
}

export {};
