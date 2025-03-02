
import { useState } from "react";
import { toast } from "sonner";
import { useAuthForm } from "@/hooks/useAuthForm";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useQuestionnaire = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { isLoading, setIsLoading, handleError } = useAuthForm();

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const startSubscriptionFlow = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if user already has a subscription
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('subscription_status, is_subscribed')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // If user already has an active subscription, redirect to home
        if (profile?.is_subscribed || profile?.subscription_status === 'active') {
          navigate('/habits');
          return;
        }

        // Create checkout session with trial period enabled
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
          body: {
            priceId: 'price_1Qsw84LDj4yzbQfIQkQ8igHs',
            returnUrl: window.location.origin + '/habits',
            includeTrialPeriod: true
          }
        });
        
        if (error) throw error;
        window.location.href = data.url;
      } else {
        throw new Error("User not authenticated");
      }
    } catch (error) {
      console.error("Error starting subscription:", error);
      handleError(error);
      navigate('/premium'); // Fallback to premium page if checkout fails
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async (questionId: string) => {
    if (!answers[questionId]?.trim()) {
      toast.error("Please select an option before continuing");
      return;
    }

    if (currentQuestionIndex < 3) { // hardcoded 3 as the index of the last question (length - 1)
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Save answers to the profile's metadata
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Update the profile with the questionnaire answers
          const { error } = await supabase
            .from('profiles')
            .update({
              updated_at: new Date().toISOString(),
              full_name: user.user_metadata.full_name || ''
            })
            .eq('id', user.id);
          
          if (error) throw error;
          
          // Store questionnaire answers in user quiz responses instead
          const { error: quizError } = await supabase
            .from('user_quiz_responses')
            .insert({
              user_id: user.id,
              fitness_level: answers.time_commitment || 'beginner',
              goals: [answers.primary_goal || 'general'],
              preferred_duration: parseInt(answers.time_commitment?.split(" ")[0]) || 15
            });
            
          if (quizError) {
            console.error("Error saving quiz responses:", quizError);
            // Continue anyway since this is not critical
          }
          
          // Redirect to subscription flow with trial
          startSubscriptionFlow();
        } else {
          throw new Error("User not authenticated");
        }
      } catch (error) {
        console.error("Error saving answers:", error);
        handleError(error);
      }
    }
  };

  return {
    currentQuestionIndex,
    answers,
    isLoading,
    handleAnswerChange,
    handleNext
  };
};
