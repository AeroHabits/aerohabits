
import { motion } from "framer-motion";
import { QuestionCard } from "./QuestionCard";
import { ProgressIndicator } from "./ProgressIndicator";
import { WelcomeMessage } from "./WelcomeMessage";
import { useQuestionnaire } from "./useQuestionnaire";
import { questions } from "./questionnaireData";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Welcome to AeroHabits</h1>
          {!showWelcomeMessage && (
            <>
              <p className="text-gray-300 mt-2">
                Let's personalize your experience ({currentQuestionIndex + 1}/{questionsLength})
              </p>
              <ProgressIndicator 
                totalSteps={questionsLength} 
                currentStep={currentQuestionIndex} 
              />
            </>
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
      </motion.div>
    </div>
  );
}
