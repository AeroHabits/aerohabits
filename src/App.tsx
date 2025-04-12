
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

// Initialize Sentry with reduced options
Sentry.init({
  dsn: "https://7f41f5a0a9c0c2d9f8b6e3a1d4c5b2a8@o4506779798454272.ingest.sentry.io/4506779799502848",
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: [/^https:\/\/areohabits\.com/],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  tracesSampleRate: 0.1, // Reduce from 1.0 to 0.1
  replaysSessionSampleRate: 0.05, // Reduce from 0.1 to 0.05
  replaysOnErrorSampleRate: 0.5, // Reduce from 1.0 to 0.5
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60000, // Increase from 30000 to 60000
      refetchOnWindowFocus: false,
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

// Wrap the app with Sentry's error boundary
const SentryErrorBoundary = Sentry.withErrorBoundary(ErrorBoundary, {
  showDialog: false, // Don't show dialog by default
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

  // Track page views
  useEffect(() => {
    if (isOnline) {
      trackPageView(location.pathname);
    }
  }, [location, isOnline]);

  return null;
});

// Layout component to handle common layout elements
const Layout = memo(({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const isOnline = useOnlineStatus();
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      isMobile && "pb-16" // Add padding at the bottom on mobile to account for the navigation bar
    )}>
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <BottomNav />
      {isOnline && (
        <Suspense fallback={null}>
          <NetworkStatusIndicator />
        </Suspense>
      )}
    </div>
  );
});

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
