import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer, dev }) => {
    // Suppress Google Maps deprecation warnings in development
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
      };
      
      // Ignore specific modules that cause SSR issues
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Handle external libraries that don't work with SSR
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        'google': 'google',
        'navigator': 'navigator',
        'window': 'window'
      });
    }
    
    // Enable better error reporting in development
    if (dev) {
      config.optimization = {
        ...config.optimization,
        minimize: false,
      };
    }
    
    return config;
  },
};

export default nextConfig;
