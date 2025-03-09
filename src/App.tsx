
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
import { useEffect, useState, memo } from "react";
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

// Create query client with platform-optimized settings
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // Increase retry count for network resilience
      retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff with max 30 second delay
      staleTime: isNative ? 60000 : 30000, // Longer stale time on mobile to reduce network requests
      refetchOnWindowFocus: !isNative, // Disable refetch on focus for mobile to save battery
      // Update error handling to use the correct format in latest React Query
      meta: {
        errorHandler: (error: Error) => {
          console.error("Query error:", error);
          Sentry.captureException(error);
        }
      }
    },
  },
});

// Use lazy initialization for query client
const queryClient = createQueryClient();

// Wrap the app with Sentry's error boundary
const SentryErrorBoundary = Sentry.withErrorBoundary(ErrorBoundary, {
  showDialog: true,
});

// Enhanced analytics tracker component
const AnalyticsTracker = memo(() => {
  const location = useLocation();
  const isOnline = useOnlineStatus();

  // Initialize analytics on mount
  useEffect(() => {
    initAnalytics();
  }, []);

  // Track page views
  useEffect(() => {
    // Only track page views when online to prevent queueing too many events
    if (isOnline) {
      trackPageView(location.pathname);
    }
  }, [location, isOnline]);

  return null;
});
AnalyticsTracker.displayName = 'AnalyticsTracker';

// Layout component to handle common layout elements
const Layout = ({ children }: { children: React.ReactNode }) => {
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
};

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
              <AppRoutes />
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </SentryErrorBoundary>
  );
};

export default App;
