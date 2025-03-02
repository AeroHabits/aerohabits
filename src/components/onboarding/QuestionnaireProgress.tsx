
import { motion } from "framer-motion";

interface QuestionnaireProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

export const QuestionnaireProgress = ({ 
  currentQuestionIndex, 
  totalQuestions 
}: QuestionnaireProgressProps) => {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-white">Welcome to AeroHabits</h1>
      <p className="text-gray-300 mt-2">
        Let's personalize your experience ({currentQuestionIndex + 1}/{totalQuestions})
      </p>
      <div className="flex gap-1 justify-center mt-4">
        {Array.from({ length: totalQuestions }).map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full w-12 transition-colors duration-300 ${
              index <= currentQuestionIndex
                ? "bg-purple-500"
                : "bg-gray-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
