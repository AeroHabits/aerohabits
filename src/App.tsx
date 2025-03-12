
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import * as Sentry from "@sentry/react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import { AppRoutes } from "./components/AppRoutes";
import { BottomNav } from "./components/layout/BottomNav";
import { useEffect, useState } from "react";
import { trackPageView, initAnalytics } from "./lib/analytics"; // Updated import path
import { useIsMobile } from "./hooks/use-mobile";
import { cn } from "./lib/utils";
import { useOnlineStatus } from "./hooks/useOnlineStatus";
import { NetworkStatusIndicator } from "./components/NetworkStatusIndicator";
import { supabase } from "@/integrations/supabase/client";

// Initialize Sentry
Sentry.init({
  dsn: "https://7f41f5a0a9c0c2d9f8b6e3a1d4c5b2a8@o4506779798454272.ingest.sentry.io/4506779799502848",
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ["localhost", /^https:\/\/areohabits\.com/],
    }),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

// Wrap the app with Sentry's error boundary
const SentryErrorBoundary = Sentry.withErrorBoundary(ErrorBoundary, {
  showDialog: true,
});

// Enhanced analytics tracker component
const AnalyticsTracker = () => {
  const location = useLocation();
  const isOnline = useOnlineStatus();

  // Initialize analytics on mount
  useEffect(() => {
    initAnalytics();
  }, []);

  // Track page views
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  return null;
};

// Layout component to handle common layout elements
const Layout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Authentication status check
  useEffect(() => {
    // Check for existing session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  // Public routes that shouldn't show the BottomNav
  const isPublicRoute = ['/auth', '/premium', '/terms', '/privacy'].includes(location.pathname);
  const shouldShowBottomNav = isAuthenticated && !isPublicRoute;
  
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      shouldShowBottomNav && isMobile && "pb-16" // Add padding only when BottomNav is shown
    )}>
      <div className="flex-1">
        {children}
      </div>
      
      {/* Only show Footer on non-public pages */}
      {!isPublicRoute && <Footer />}
      
      {/* Only show BottomNav for authenticated users on non-public pages */}
      {shouldShowBottomNav && <BottomNav />}
      
      <NetworkStatusIndicator />
    </div>
  );
};

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
