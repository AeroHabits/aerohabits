
import { Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { lazy, Suspense, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

// Lazy load all page components for better performance
const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const Habits = lazy(() => import("@/pages/Habits"));
const Goals = lazy(() => import("@/pages/Goals"));
const Journey = lazy(() => import("@/pages/Journey"));
const Challenges = lazy(() => import("@/pages/Challenges"));
const Settings = lazy(() => import("@/pages/Settings"));
const Terms = lazy(() => import("@/pages/Terms"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Onboarding = lazy(() => import("@/pages/Onboarding"));
const Support = lazy(() => import("@/pages/Support"));

// Loading fallback component
const RouteLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
    <div className="rounded-full h-12 w-12 border-b-2 border-white animate-spin"></div>
  </div>
);

export function AppRoutes() {
  const location = useLocation();
  
  // Log route changes to help with debugging
  useEffect(() => {
    console.log("Route changed to:", location.pathname);
  }, [location.pathname]);
  
  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* Non-protected routes */}
        <Route path="/auth" element={
          <Suspense fallback={<RouteLoadingFallback />}>
            <Auth />
          </Suspense>
        } />
        <Route path="/terms" element={
          <Suspense fallback={<RouteLoadingFallback />}>
            <Terms />
          </Suspense>
        } />
        <Route path="/privacy" element={
          <Suspense fallback={<RouteLoadingFallback />}>
            <Privacy />
          </Suspense>
        } />
        <Route path="/support" element={
          <Suspense fallback={<RouteLoadingFallback />}>
            <Support />
          </Suspense>
        } />
        
        {/* Protected routes */}
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoadingFallback />}>
                <Onboarding />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoadingFallback />}>
                <Index />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoadingFallback />}>
                <Habits />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoadingFallback />}>
                <Goals />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/journey"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoadingFallback />}>
                <Journey />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/challenges"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoadingFallback />}>
                <Challenges />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Suspense fallback={<RouteLoadingFallback />}>
                <Settings />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}
