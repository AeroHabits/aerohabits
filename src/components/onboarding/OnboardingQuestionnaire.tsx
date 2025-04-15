
import { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { QuestionCard } from "./QuestionCard";
import { ProgressIndicator } from "./ProgressIndicator";
import { WelcomeMessage } from "./WelcomeMessage";
import { useQuestionnaire } from "./useQuestionnaire";
import { questions } from "./questionnaireData";

// Memoize the QuestionCard to prevent unnecessary re-renders
const MemoizedQuestionCard = memo(QuestionCard);
const MemoizedProgressIndicator = memo(ProgressIndicator);

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

  // Memoize handlers
  const memoizedHandleAnswerChange = useCallback(handleAnswerChange, [handleAnswerChange]);
  const memoizedHandleNext = useCallback(handleNext, [handleNext]);
  const memoizedStartSubscriptionFlow = useCallback(startSubscriptionFlow, [startSubscriptionFlow]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-900 to-black p-4 overflow-hidden">
      {/* Optimize gradients by using simpler backgrounds on mobile */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent pointer-events-none"></div>
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-cyan-900/10 to-transparent pointer-events-none"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-lg w-full relative z-10"
        style={{ willChange: 'auto' }} // Optimize rendering
      >
        <div className="mb-8 text-center">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-500">
              Welcome to AeroHabits
            </span>
          </motion.h1>
          
          {!showWelcomeMessage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <p className="text-gray-300 mt-3 mb-4">
                Let's personalize your experience ({currentQuestionIndex + 1}/{questionsLength})
              </p>
              <MemoizedProgressIndicator 
                totalSteps={questionsLength} 
                currentStep={currentQuestionIndex} 
              />
            </motion.div>
          )}
        </div>

        {showWelcomeMessage ? (
          <WelcomeMessage 
            primaryGoal={getPrimaryGoal()} 
            onContinue={memoizedStartSubscriptionFlow} 
            isLoading={isLoading} 
          />
        ) : (
          <MemoizedQuestionCard
            question={currentQuestion}
            answers={answers[currentQuestion.id] || []}
            onAnswerChange={memoizedHandleAnswerChange}
            onNext={memoizedHandleNext}
            isLoading={isLoading}
            isLastQuestion={isLastQuestion}
          />
        )}
        
        <motion.div 
          className="text-center mt-8 text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          Building better habits, one step at a time
        </motion.div>
      </motion.div>
    </div>
  );
}
