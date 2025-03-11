
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

// Initialize Sentry with platform-specific settings
Sentry.init({
  dsn: "https://7f41f5a0a9c0c2d9f8b6e3a1d4c5b2a8@o4506779798454272.ingest.sentry.io/4506779799502848",
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ["localhost", /^https:\/\/areohabits\.com/],
    }),
    new Sentry.Replay(),
  ],
  // Adjust sampling rates based on platform for better performance on mobile
  tracesSampleRate: isNative ? 0.5 : 1.0,
  replaysSessionSampleRate: isNative ? 0.05 : 0.1,
  replaysOnErrorSampleRate: 1.0,
  // Add platform info to help with debugging
  initialScope: {
    tags: {
      platform: Capacitor.getPlatform(),
      isNative: isNative.toString()
    }
  }
});

// Create query client with optimized settings for better performance
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Reduced from 3 to minimize unnecessary retries
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
      // Significantly increased stale time to reduce unnecessary refetches
      staleTime: isNative ? 300000 : 180000, // 5 min on mobile, 3 min on web
      // Disable automatic background refetching
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      refetchOnMount: false,
      // Improved caching policy
      gcTime: 24 * 60 * 60 * 1000, // Keep cache for 24 hours
      meta: {
        errorHandler: (error: Error) => {
          console.error("Query error:", error);
          Sentry.captureException(error);
        }
      }
    },
  },
});

// Use lazy initialization for query client and prevent recreation on re-renders
const queryClient = createQueryClient();

// Wrap the app with Sentry's error boundary
const SentryErrorBoundary = Sentry.withErrorBoundary(ErrorBoundary, {
  showDialog: true,
});

// Enhanced analytics tracker component with better performance
const AnalyticsTracker = memo(() => {
  const location = useLocation();
  const isOnline = useOnlineStatus();

  // Initialize analytics on mount
  useEffect(() => {
    initAnalytics();
  }, []);

  // Track page views - optimized to reduce unnecessary tracking
  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        trackPageView(location.pathname);
      }, 1000); // Debounce to prevent excessive tracking during rapid navigation
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isOnline]);

  return null;
});
AnalyticsTracker.displayName = 'AnalyticsTracker';

// Layout component to handle common layout elements
const Layout = memo(({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      isMobile && "pb-16" // Add padding at the bottom on mobile to account for the navigation bar
    )}>
      <TrialNotificationBanner />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <BottomNav />
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
  // On iOS, disable right-click menu and text selection for app-like feel
  useEffect(() => {
    if (Capacitor.getPlatform() === 'ios') {
      document.addEventListener('contextmenu', e => e.preventDefault());
      
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
          <Toaster />
          <Sonner />
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
