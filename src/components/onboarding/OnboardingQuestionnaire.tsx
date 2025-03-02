
import { motion } from "framer-motion";
import { useQuestionnaire } from "./useQuestionnaire";
import { QuestionnaireProgress } from "./QuestionnaireProgress";
import { QuestionCard } from "./QuestionCard";
import { questions } from "./questionnaireData";

export function OnboardingQuestionnaire() {
  const {
    currentQuestionIndex,
    currentQuestion,
    answers,
    isLoading,
    isLastQuestion,
    handleAnswerChange,
    handleNext,
    questionsLength
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
          <p className="text-gray-300 mt-2">
            Let's personalize your experience ({currentQuestionIndex + 1}/{questionsLength})
          </p>
          <QuestionnaireProgress 
            currentQuestionIndex={currentQuestionIndex}
            totalQuestions={questionsLength}
          />
        </div>

        <QuestionCard
          question={currentQuestion}
          currentAnswers={answers[currentQuestion.id] || []}
          onAnswerChange={handleAnswerChange}
          onNext={handleNext}
          isLoading={isLoading}
          isLastQuestion={isLastQuestion}
        />
      </motion.div>
    </div>
  );
}
