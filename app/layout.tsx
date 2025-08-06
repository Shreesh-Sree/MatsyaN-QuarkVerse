import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ClientErrorHandler } from '@/components/ClientErrorHandler';

// Suppress Google Maps deprecation warnings in development
if (process.env.NODE_ENV === 'development') {
  import('@/utils/console-suppression');
}

export const metadata: Metadata = {
  title: 'FisherMate.AI - AI Fishing Companion',
  description: 'AI-powered fishing companion with weather updates, safety guidelines, fishing journal, and voice assistance.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script 
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', async () => {
                  try {
                    const registration = await navigator.serviceWorker.register('/sw.js');
                    console.log('ServiceWorker registered');
                  } catch (error) {
                    console.log('ServiceWorker registration failed');
                  }
                });
              }
            `
          }}
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen bg-custom-white dark:bg-black">
        <ClientErrorHandler />
        <ErrorBoundary>
          <AuthProvider>
            <LanguageProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <ErrorBoundary fallback={<div className="p-4 text-center">Failed to load header</div>}>
                  <Header />
                </ErrorBoundary>
                <main className="flex-1">
                  <ErrorBoundary fallback={<div className="p-8 text-center">
                    <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                    <p>Please refresh the page to try again.</p>
                  </div>}>
                    {children}
                  </ErrorBoundary>
                </main>
                <ErrorBoundary fallback={<div className="p-4 text-center">Failed to load footer</div>}>
                  <Footer />
                </ErrorBoundary>
                <Toaster />
                <SonnerToaster 
                  position="top-right" 
                  richColors 
                  closeButton 
                  expand={false}
                  visibleToasts={3}
                />
              </ThemeProvider>
            </LanguageProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
