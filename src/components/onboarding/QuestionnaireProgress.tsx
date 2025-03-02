
import { motion } from "framer-motion";

interface QuestionnaireProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
}

export function QuestionnaireProgress({ 
  currentQuestionIndex, 
  totalQuestions 
}: QuestionnaireProgressProps) {
  return (
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
  );
}
