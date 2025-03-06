import { motion } from "framer-motion";
import { QuestionCard } from "./QuestionCard";
import { ProgressIndicator } from "./ProgressIndicator";
import { WelcomeMessage } from "./WelcomeMessage";
import { useQuestionnaire } from "./useQuestionnaire";
import { questions } from "./questionnaireData";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function OnboardingQuestionnaire() {
  const {
    currentQuestionIndex,
    currentQuestion,
    answers,
    isLoading,
    showWelcomeMessage,
    isLastQuestion,
    questionsLength,
    handleAnswerChange,
    handleNext,
    startSubscriptionFlow,
    getPrimaryGoal
  } = useQuestionnaire();

  // Check if user should see the questionnaire
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        // User is guaranteed to exist because of ProtectedRoute
        console.log("Checking onboarding access for user:", user?.id);
        console.log("User metadata:", user?.user_metadata);

        // Check if user has already completed the quiz
        const { data: quizResponses } = await supabase
          .from('user_quiz_responses')
          .select('id')
          .eq('user_id', user?.id)
          .maybeSingle();

        // Check subscription status
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_subscribed, subscription_status')
          .eq('id', user?.id)
          .maybeSingle();

        const hasCompletedQuiz = !!quizResponses;
        const hasActiveSubscription = profile?.is_subscribed || 
          ['active', 'trialing'].includes(profile?.subscription_status || '');

        console.log("Has completed quiz:", hasCompletedQuiz);
        console.log("Has active subscription:", hasActiveSubscription);

        // Only users without quiz responses AND without subscription should be here
        if (hasCompletedQuiz && hasActiveSubscription) {
          toast.error("You've already completed onboarding and have an active subscription");
          // User has already completed, no need to redirect as ProtectedRoute will handle redirection
        }
      } catch (error) {
        console.error("Error checking user status:", error);
        toast.error("An error occurred while checking your account status");
      }
    };

    checkUserStatus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,70,190,0.05)_0,rgba(0,0,0,0)_60%)] pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full relative z-10"
      >
        <div className="mb-8 text-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-500">
              Welcome to AeroHabits
            </span>
          </motion.h1>
          
          {!showWelcomeMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <p className="text-gray-300 mt-3 mb-4">
                Complete this quiz to start your free trial ({currentQuestionIndex + 1}/{questionsLength})
              </p>
              <ProgressIndicator 
                totalSteps={questionsLength} 
                currentStep={currentQuestionIndex} 
              />
            </motion.div>
          )}
        </div>

        {showWelcomeMessage ? (
          <WelcomeMessage 
            primaryGoal={getPrimaryGoal()} 
            onContinue={startSubscriptionFlow} 
            isLoading={isLoading} 
          />
        ) : (
          <QuestionCard
            question={currentQuestion}
            answers={answers[currentQuestion.id] || []}
            onAnswerChange={handleAnswerChange}
            onNext={handleNext}
            isLoading={isLoading}
            isLastQuestion={isLastQuestion}
          />
        )}
        
        <motion.div 
          className="text-center mt-8 text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          Building better habits, one step at a time
        </motion.div>
      </motion.div>
    </div>
  );
}
