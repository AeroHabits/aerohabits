import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import Index from "@/pages/Index";
import Journey from "@/pages/Journey";
import Goals from "@/pages/Goals";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Auth from "@/pages/Auth";
import Calendar from "@/pages/Calendar";

export const AppRoutes = () => (
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
      path="/journey"
      element={
        <ProtectedRoute>
          <Journey />
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
      path="/calendar"
      element={
        <ProtectedRoute>
          <Calendar />
        </ProtectedRoute>
      }
    />
  </Routes>
);