
import { Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Habits from "@/pages/Habits";
import Goals from "@/pages/Goals";
import Journey from "@/pages/Journey";
import Challenges from "@/pages/Challenges";
import Settings from "@/pages/Settings";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Onboarding from "@/pages/Onboarding";
import Support from "@/pages/Support";
import { lazy, Suspense, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Detect iOS platform
const isIOS = typeof navigator !== 'undefined' && 
  (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

// iOS-optimized animations - simpler and fewer props
const getPageTransition = () => ({
  initial: isIOS ? { opacity: 0 } : { opacity: 0 },
  animate: isIOS ? { opacity: 1 } : { opacity: 1 },
  exit: isIOS ? { opacity: 0 } : { opacity: 0 },
  transition: isIOS ? { duration: 0.15 } : { duration: 0.2 }
});

// Loading fallback component - optimized for iOS
const RouteLoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
    <div className={isIOS ? "rounded-full h-10 w-10 border-b-2 border-white animate-spin" : "rounded-full h-12 w-12 border-b-2 border-white animate-spin"}></div>
  </div>
);

export function AppRoutes() {
  const location = useLocation();
  const pageTransition = useMemo(() => getPageTransition(), []);
  
  // Reset scroll position on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <AnimatePresence mode={isIOS ? "sync" : "wait"}>
      <Routes location={location} key={location.pathname}>
        {/* Non-protected routes */}
        <Route path="/auth" element={
          <motion.div {...pageTransition}>
            <Auth />
          </motion.div>
        } />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/support" element={<Support />} />
        
        {/* Protected routes - optimize suspense for iOS */}
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
