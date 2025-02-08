
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { MobileNav } from "./MobileNav";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const { data: canAccessApp, isLoading: isCheckingAccess } = useQuery({
    queryKey: ['app-access'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.rpc('can_access_app', {
        user_uid: user.id
      });

      if (error) {
        console.error('Error checking app access:', error);
        return false;
      }

      if (!data) {
        toast.error("Your trial has expired. Please upgrade to continue using the app.");
      }

      return data;
    },
    enabled: isAuthenticated,
  });

  useEffect(() => {
    // Check for existing session on component mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading || isCheckingAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (isAuthenticated && !canAccessApp) {
    return <Navigate to="/pricing" replace />;
  }

  return (
    <>
      {children}
      <MobileNav />
    </>
  );
};
