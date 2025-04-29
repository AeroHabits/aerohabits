
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { QuestionItem } from "./questionnaireData";
import { QuestionOption } from "./QuestionOption";

interface QuestionCardProps {
  question: QuestionItem;
  answers: string[];
  onAnswerChange: (value: string, checked: boolean) => void;
  onNext: () => void;
  isLoading: boolean;
  isLastQuestion: boolean;
}

export function QuestionCard({ 
  question, 
  answers, 
  onAnswerChange, 
  onNext, 
  isLoading,
  isLastQuestion
}: QuestionCardProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center justify-center mb-4">
          <motion.div
            key={question.id + "-icon"}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-3 bg-[#2A2F3C]/70 rounded-full border border-[#403E43]"
          >
            {question.icon && React.cloneElement(question.icon, { className: "w-8 h-8 text-[#9b87f5]" })}
          </motion.div>
        </div>
        
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <Label className="text-lg text-white text-center block">
            {question.question}
          </Label>
          
          <div className="gap-3 flex flex-col">
            {question.options.map((option) => (
              <QuestionOption 
                key={option}
                id={question.id}
                option={option}
                isChecked={answers.includes(option)}
                onCheckedChange={onAnswerChange}
              />
            ))}
          </div>
          
          <Button
            onClick={onNext}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#7b6acd] to-[#9b87f5] hover:from-[#6b5abd] hover:to-[#8a76e4] text-white"
          >
            {isLastQuestion ? (
              isLoading ? "Saving..." : "Complete"
            ) : (
              <>
                Next Question <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}
