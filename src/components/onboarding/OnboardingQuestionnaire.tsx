
import { motion } from "framer-motion";
import { questions } from "./questionnaireData";
import { QuestionnaireProgress } from "./QuestionnaireProgress";
import { QuestionCard } from "./QuestionCard";
import { useQuestionnaire } from "./useQuestionnaire";

export function OnboardingQuestionnaire() {
  const {
    currentQuestionIndex,
    answers,
    isLoading,
    handleAnswerChange,
    handleNext
  } = useQuestionnaire();

  const currentQuestion = questions[currentQuestionIndex];
  
  const handleCurrentAnswerChange = (value: string) => {
    handleAnswerChange(currentQuestion.id, value);
  };
  
  const handleNextQuestion = () => {
    handleNext(currentQuestion.id);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full"
      >
        <QuestionnaireProgress 
          currentQuestionIndex={currentQuestionIndex} 
          totalQuestions={questions.length} 
        />

        <QuestionCard
          question={currentQuestion}
          currentValue={answers[currentQuestion.id] || ""}
          onValueChange={handleCurrentAnswerChange}
          onNext={handleNextQuestion}
          isLoading={isLoading}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
        />
      </motion.div>
    </div>
  );
}
