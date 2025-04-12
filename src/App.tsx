
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
import { useEffect, lazy, Suspense, memo } from "react";
import { trackPageView, initAnalytics } from "./lib/analytics";
import { useIsMobile } from "./hooks/use-mobile";
import { cn } from "./lib/utils";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

// Lazy load non-critical components
const NetworkStatusIndicator = lazy(() => 
  import("./components/NetworkStatusIndicator").then(module => ({ 
    default: module.NetworkStatusIndicator 
  }))
);

// Create query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60000,
      refetchOnWindowFocus: false,
      gcTime: 10 * 60 * 1000,
    },
  },
});

// Lightweight Sentry config to reduce overhead
Sentry.init({
  dsn: "https://7f41f5a0a9c0c2d9f8b6e3a1d4c5b2a8@o4506779798454272.ingest.sentry.io/4506779799502848",
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: [/^https:\/\/areohabits\.com/],
    }),
  ],
  tracesSampleRate: 0.05, // Further reduce sample rate
  beforeSend(event) {
    // Don't send events in development
    if (window.location.hostname === 'localhost') {
      return null;
    }
    return event;
  },
});

// Wrap the app with Sentry's error boundary
const SentryErrorBoundary = Sentry.withErrorBoundary(ErrorBoundary, {
  showDialog: false,
});

// Memoized analytics tracker component
const AnalyticsTracker = memo(() => {
  const location = useLocation();
  const isOnline = useOnlineStatus();

  // Initialize analytics on mount
  useEffect(() => {
    if (isOnline) {
      initAnalytics();
    }
  }, [isOnline]);

  // Track page views with debouncing to prevent excessive calls
  useEffect(() => {
    if (isOnline) {
      const timeoutId = setTimeout(() => {
        trackPageView(location.pathname);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [location, isOnline]);

  return null;
});
AnalyticsTracker.displayName = 'AnalyticsTracker';

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
      {isOnline && (
        <Suspense fallback={null}>
          <NetworkStatusIndicator />
        </Suspense>
      )}
    </div>
  );
});
Layout.displayName = 'Layout';

const App = () => (
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

export default App;
