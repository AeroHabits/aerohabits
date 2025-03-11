
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import { AppRoutes } from "./components/AppRoutes";
import { BottomNav } from "./components/layout/BottomNav";
import { useEffect, useState, memo, lazy, Suspense } from "react";
import { trackPageView, initAnalytics } from "./lib/analytics";
import { useIsMobile } from "./hooks/use-mobile";
import { cn } from "./lib/utils";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { NetworkStatusIndicator } from "./components/NetworkStatusIndicator";
import { TrialNotificationBanner } from "./components/TrialNotificationBanner";
import { NetworkRecoveryHandler } from "./components/NetworkRecoveryHandler";
import { Capacitor } from '@capacitor/core';

// Detect if we're running in a native app context
const isNative = Capacitor.isNativePlatform();

// Initialize Sentry with optimized settings for performance
Sentry.init({
  dsn: "https://7f41f5a0a9c0c2d9f8b6e3a1d4c5b2a8@o4506779798454272.ingest.sentry.io/4506779799502848",
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ["localhost", /^https:\/\/areohabits\.com/],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  // Adjust sampling rates for better performance
  tracesSampleRate: isNative ? 0.2 : 0.5, // Reduced sampling rate
  replaysSessionSampleRate: isNative ? 0.01 : 0.05, // Significantly reduced
  replaysOnErrorSampleRate: isNative ? 0.5 : 1.0, // Still capture most errors
  // Add platform info to help with debugging
  initialScope: {
    tags: {
      platform: Capacitor.getPlatform(),
      isNative: isNative.toString()
    }
  },
  // Prevent memory leaks from large payloads
  maxBreadcrumbs: 50, // Default is 100
});

// Create query client with optimized settings
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Reduced from 2 to minimize retries which can cause performance issues
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 10000), // Cap at 10 seconds
      staleTime: isNative ? 600000 : 300000, // 10 min on mobile, 5 min on web
      refetchOnWindowFocus: false,
      refetchOnReconnect: false, // Let the app control reconnection behavior 
      refetchOnMount: false,
      gcTime: 12 * 60 * 60 * 1000, // Keep cache for 12 hours instead of 24
      enabled: typeof window !== 'undefined' // Prevent queries during SSR
    },
  },
});

// Use lazy initialization for query client
const queryClient = createQueryClient();

// Wrap the app with Sentry's error boundary
const SentryErrorBoundary = Sentry.withErrorBoundary(ErrorBoundary, {
  showDialog: false, // Don't show dialog by default to reduce disruption
});

// Enhanced analytics tracker component with better performance
const AnalyticsTracker = memo(() => {
  const location = useLocation();
  const isOnline = useOnlineStatus();
  const [isAnalyticsInitialized, setIsAnalyticsInitialized] = useState(false);

  // Initialize analytics only once
  useEffect(() => {
    if (!isAnalyticsInitialized) {
      initAnalytics();
      setIsAnalyticsInitialized(true);
    }
  }, [isAnalyticsInitialized]);

  // Track page views with more aggressive debouncing
  useEffect(() => {
    if (isOnline && isAnalyticsInitialized) {
      const timer = setTimeout(() => {
        trackPageView(location.pathname);
      }, 2000); // Increased debounce to 2 seconds
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isOnline, isAnalyticsInitialized]);

  return null;
});
AnalyticsTracker.displayName = 'AnalyticsTracker';

// Layout component to handle common layout elements
const Layout = memo(({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      isMobile && "pb-16" // Add padding at the bottom on mobile
    )}>
      <TrialNotificationBanner />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      {isMobile && <BottomNav />}
      <NetworkStatusIndicator />
      <NetworkRecoveryHandler />
    </div>
  );
});
Layout.displayName = 'Layout';

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse text-center">
      <div className="h-12 w-12 rounded-full bg-blue-500/20 mx-auto mb-3"></div>
      <p className="text-blue-500">Loading...</p>
    </div>
  </div>
);

const App = () => {
  // Limit context menu on iOS
  useEffect(() => {
    if (Capacitor.getPlatform() === 'ios') {
      // Use passive event listeners for better performance
      document.addEventListener('contextmenu', e => e.preventDefault(), { passive: true });
      
      // Add iOS-specific body classes
      document.body.classList.add('ios-device');
    }
    
    return () => {
      if (Capacitor.getPlatform() === 'ios') {
        document.removeEventListener('contextmenu', e => e.preventDefault());
        document.body.classList.remove('ios-device');
      }
    };
  }, []);

  return (
    <SentryErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {/* Only render toasts when needed */}
          <Toaster />
          <Sonner position="top-right" closeButton toastOptions={{ duration: 3000 }} />
          <BrowserRouter>
            <AnalyticsTracker />
            <Layout>
              <Suspense fallback={<LoadingFallback />}>
                <AppRoutes />
              </Suspense>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SentryErrorBoundary>
  );
};

export default App;
