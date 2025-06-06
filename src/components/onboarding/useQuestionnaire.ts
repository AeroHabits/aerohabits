
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthForm } from "@/hooks/useAuthForm";
import { questions } from "./questionnaireData";

export function useQuestionnaire() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { isLoading, setIsLoading, handleError } = useAuthForm();
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerChange = (value: string, checked: boolean) => {
    setAnswers(prev => {
      const currentAnswers = prev[currentQuestion.id] || [];
      
      if (checked) {
        // Add the value if it's checked
        return {
          ...prev,
          [currentQuestion.id]: [...currentAnswers, value]
        };
      } else {
        // Remove the value if it's unchecked
        return {
          ...prev,
          [currentQuestion.id]: currentAnswers.filter(item => item !== value)
        };
      }
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

        // Navigate to premium page
        navigate('/premium');
        
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

  const saveAnswers = async () => {
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
        
        // Get the primary goal (first one selected) or default to the first answer
        const primaryGoal = answers.primary_goal?.[0] || 'general';
        
        // Calculate preferred duration from time commitment
        // Extract the first number from the first selected option
        const timeCommitment = answers.time_commitment?.[0] || '15-20 minutes';
        const durationMatch = timeCommitment.match(/\d+/);
        const preferredDuration = durationMatch ? parseInt(durationMatch[0]) : 15;
        
        // Store questionnaire answers in user quiz responses
        const { error: quizError } = await supabase
          .from('user_quiz_responses')
          .insert({
            user_id: user.id,
            fitness_level: answers.time_commitment?.[0] || 'beginner',
            goals: answers.primary_goal || ['general'],
            preferred_duration: preferredDuration
          });
          
        if (quizError) {
          console.error("Error saving quiz responses:", quizError);
          // Continue anyway since this is not critical
        }
        
        // Show welcome message instead of immediately redirecting
        setShowWelcomeMessage(true);
      } else {
        throw new Error("User not authenticated");
      }
    } catch (error) {
      console.error("Error saving answers:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (!answers[currentQuestion.id] || answers[currentQuestion.id].length === 0) {
      toast.error("Please select at least one option before continuing");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Save answers and show welcome message
      await saveAnswers();
    }
  };

  // Get primary goal for personalized welcome message
  const getPrimaryGoal = () => {
    return answers.primary_goal?.[0] || '';
  };

  return {
    currentQuestionIndex,
    currentQuestion,
    answers,
    isLoading,
    showWelcomeMessage,
    isLastQuestion,
    questionsLength: questions.length,
    handleAnswerChange,
    handleNext,
    startSubscriptionFlow,
    getPrimaryGoal
  };
}
