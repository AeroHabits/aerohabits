import { Routes, Route } from "react-router-dom";
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
import Premium from "@/pages/Premium";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/habits"
        element={
          <ProtectedRoute>
            <Habits />
          </ProtectedRoute>
        }
      />
      <Route
        path="/goals"
        element={
          <ProtectedRoute>
            <Goals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/journey"
        element={
          <ProtectedRoute>
            <Journey />
          </ProtectedRoute>
        }
      />
      <Route
        path="/challenges"
        element={
          <ProtectedRoute>
            <Challenges />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route path="/premium" element={<Premium />} />
    </Routes>
  );
}
