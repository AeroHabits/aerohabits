
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PricingCard } from "@/components/premium/PricingCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/ui/loader";

export default function Premium() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const checkoutSuccess = searchParams.get("checkout_success") === "true";
  const sessionId = searchParams.get("session_id");

  // Verify subscription if coming from successful checkout
  useEffect(() => {
    const verifySubscription = async () => {
      if (checkoutSuccess && sessionId) {
        setIsVerifying(true);
        
        try {
          // Call your backend to verify the subscription
          const { data, error } = await supabase.functions.invoke('verify-subscription', {
            body: { sessionId }
          });
          
          if (error) throw error;
          
          if (data?.verified) {
            toast.success("Your subscription has been verified!");
            // Redirect to app home after verification
            navigate("/", { replace: true });
            return;
          } else {
            toast.error("Could not verify your subscription. Please try again or contact support.");
          }
        } catch (error) {
          console.error("Error verifying subscription:", error);
          toast.error("Failed to verify subscription. Please contact support.");
        } finally {
          setIsVerifying(false);
        }
      } else if (checkoutSuccess) {
        // If success but no session ID, still try to verify
        syncSubscriptionStatus();
      }
    };

    verifySubscription();
  }, [checkoutSuccess, sessionId, navigate]);

  // Check subscription status on page load
  const syncSubscriptionStatus = async () => {
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-subscription', {
        body: {}
      });
      
      if (error) throw error;
      
      if (data?.updated && ['active', 'trialing'].includes(data?.status)) {
        toast.success("Your subscription is now active!");
        // Redirect to app home if subscription is active
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Error syncing subscription:", error);
    } finally {
      setIsVerifying(false);
    }
  };

  // Check if user already has an active subscription
  const { data: profile, isLoading } = useQuery({
    queryKey: ['premium-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .select('is_subscribed, subscription_status')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      // If user already has active subscription, redirect to app
      if (data?.is_subscribed || ['active', 'trialing'].includes(data?.subscription_status || '')) {
        navigate("/", { replace: true });
      }
    }
  });

  // Premium features list
  const features = [
    "Unlimited habit tracking",
    "Advanced analytics and insights",
    "Custom goals and milestones",
    "Priority support",
    "Ad-free experience",
    "Data backup and sync",
    "Exclusive premium challenges"
  ];

  // Premium challenges examples
  const premiumChallenges = [
    {
      title: "30-Day Transformation",
      description: "Follow our expert-designed 30-day plan for maximum results"
    },
    {
      title: "Mindfulness Master",
      description: "Daily mindfulness exercises to reduce stress and improve focus"
    },
    {
      title: "Sleep Optimization",
      description: "Track and improve your sleep quality with expert guidance"
    }
  ];

  if (isLoading || isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 mx-auto text-indigo-500" />
          <p className="mt-4 text-white">
            {isVerifying ? "Verifying your subscription..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Upgrade to Premium</h1>
          <p className="text-gray-300 mt-2">
            Take your habit journey to the next level
          </p>
        </div>

        <PricingCard features={features} premiumChallenges={premiumChallenges} />
      </div>
    </div>
  );
}
