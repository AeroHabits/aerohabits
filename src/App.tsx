
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
import { useEffect, lazy, Suspense, memo, useState, useMemo } from "react";
import { trackPageView, initAnalytics } from "./lib/analytics";
import { useIsMobile } from "./hooks/use-mobile";
import { cn } from "./lib/utils";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { usePrefetch } from "./hooks/usePrefetch";

// Lazy load non-critical components with increased delay for iOS
const NetworkStatusIndicator = lazy(() => 
  import("./components/NetworkStatusIndicator").then(module => ({ 
    default: module.NetworkStatusIndicator 
  }))
);

// Detect iOS platform
const isIOS = typeof navigator !== 'undefined' && 
  (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

// Create optimized query client with performance settings
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: isIOS ? 0 : 1, // No retries on iOS to reduce network attempts
      staleTime: isIOS ? 120000 : 60000, // 2 minutes stale time on iOS, 1 minute elsewhere
      refetchOnWindowFocus: false,
      gcTime: isIOS ? 15 * 60 * 1000 : 10 * 60 * 1000, // Longer cache on iOS
    },
  },
});

// Memoized analytics tracker component
const AnalyticsTracker = memo(() => {
  const location = useLocation();
  const isOnline = useOnlineStatus();
  const [initialized, setInitialized] = useState(false);

  // Initialize analytics on mount - only once and delayed for iOS
  useEffect(() => {
    if (isOnline && !initialized) {
      const delay = isIOS ? 3000 : 0; // Delay analytics init on iOS
      const timeoutId = setTimeout(() => {
        try {
          initAnalytics();
          setInitialized(true);
        } catch (err) {
          console.error("Failed to initialize analytics:", err);
        }
      }, delay);
      return () => clearTimeout(timeoutId);
    }
  }, [isOnline, initialized]);

  // Track page views with debouncing and sampling for iOS
  useEffect(() => {
    if (isOnline && initialized) {
      // For iOS, add sampling to reduce analytics events
      if (isIOS && Math.random() > 0.5) return; // Only track 50% of pageviews on iOS
      
      const timeoutId = setTimeout(() => {
        try {
          trackPageView(location.pathname);
        } catch (err) {
          console.error("Failed to track page view:", err);
        }
      }, isIOS ? 1000 : 300); // Longer debounce for iOS
      return () => clearTimeout(timeoutId);
    }
  }, [location, isOnline, initialized]);

  return null;
});
AnalyticsTracker.displayName = 'AnalyticsTracker';

// PrefetchHandler for route prefetching
const PrefetchHandler = memo(() => {
  usePrefetch(); // Use our prefetching hook
  return null;
});
PrefetchHandler.displayName = 'PrefetchHandler';

// Layout component to handle common layout elements
const Layout = memo(({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const isOnline = useOnlineStatus();
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      isMobile && "pb-16"
    )}>
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      {isMobile && <BottomNav />}
      {/* Only show network indicator when necessary and not on iOS */}
      {!isOnline && !isIOS && (
        <Suspense fallback={null}>
          <NetworkStatusIndicator />
        </Suspense>
      )}
    </div>
  );
});
Layout.displayName = 'Layout';

// Create a simple fallback error component
const FallbackComponent = ({error}: {error: Error}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-700 mb-4">{error.message || 'An unexpected error occurred'}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Reload page
        </button>
      </div>
    </div>
  );
};

const App = () => {
  // Create query client once to prevent recreation on renders
  const queryClient = useMemo(() => createQueryClient(), []);
  const [initError, setInitError] = useState<Error | null>(null);

  // Initialize Sentry with optimized configuration
  useEffect(() => {
    try {
      console.log("Initializing app");
      
      Sentry.init({
        dsn: "https://7f41f5a0a9c0c2d9f8b6e3a1d4c5b2a8@o4506779798454272.ingest.sentry.io/4506779799502848",
        integrations: [
          new Sentry.BrowserTracing({
            tracePropagationTargets: [/^https:\/\/areohabits\.com/],
          }),
        ],
        tracesSampleRate: isIOS ? 0.01 : 0.05, // Further reduce sample rate on iOS
        beforeSend(event) {
          // Don't send events in development or on iOS unless critical errors
          if (window.location.hostname === 'localhost' || 
              (isIOS && event.level !== 'fatal')) {
            return null;
          }
          return event;
        },
      });
    } catch (err) {
      console.error("App initialization error:", err);
      setInitError(err instanceof Error ? err : new Error(String(err)));
    }
  }, []);

  if (initError) {
    return <FallbackComponent error={initError} />;
  }

  return (
    <Sentry.ErrorBoundary fallback={FallbackComponent}>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnalyticsTracker />
              <PrefetchHandler />
              <Layout>
                <AppRoutes />
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </Sentry.ErrorBoundary>
  );
};

export default App;
