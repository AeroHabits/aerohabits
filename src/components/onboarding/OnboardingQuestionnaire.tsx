
import { motion } from "framer-motion";
import { QuestionCard } from "./QuestionCard";
import { ProgressIndicator } from "./ProgressIndicator";
import { WelcomeMessage } from "./WelcomeMessage";
import { useQuestionnaire } from "./useQuestionnaire";
import { questions } from "./questionnaireData";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export function OnboardingQuestionnaire() {
  const navigate = useNavigate();
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
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Not logged in, redirect to auth
        navigate('/auth');
        return;
      }

      // Check if this is a new user (from metadata)
      const isNewUser = user.user_metadata?.is_new_user;
      
      // Check if user has already completed the quiz
      const { data: quizResponses } = await supabase
        .from('user_quiz_responses')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      // Check subscription status
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_subscribed')
        .eq('id', user.id)
        .maybeSingle();

      // If not a new user or already has responses or already subscribed, redirect to habits
      if (!isNewUser || quizResponses || profile?.is_subscribed) {
        navigate('/habits');
      }
    };

    checkUserStatus();
  }, [navigate]);

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
                Let's personalize your experience ({currentQuestionIndex + 1}/{questionsLength})
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
