
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Goals from "@/pages/Goals";
import Journey from "@/pages/Journey";
import Challenges from "@/pages/Challenges";
import Badges from "@/pages/Badges";
import Pricing from "@/pages/Pricing";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
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
      <Route path="/challenges" element={<Challenges />} />
      <Route
        path="/badges"
        element={
          <ProtectedRoute>
            <Badges />
          </ProtectedRoute>
        }
      />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
    </Routes>
  );
}
