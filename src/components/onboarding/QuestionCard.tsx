
import { motion } from "framer-motion";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionOption } from "./QuestionOption";
import { QuestionType } from "./types";

interface QuestionCardProps {
  question: QuestionType;
  currentValue: string;
  onValueChange: (value: string) => void;
  onNext: () => void;
  isLoading: boolean;
  isLastQuestion: boolean;
}

export const QuestionCard = ({
  question,
  currentValue,
  onValueChange,
  onNext,
  isLoading,
  isLastQuestion
}: QuestionCardProps) => {
  return (
    <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
      <CardContent className="pt-6 space-y-6">
        <div className="flex items-center justify-center mb-4">
          <motion.div
            key={question.id + "-icon"}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-3 bg-gray-700/50 rounded-full"
          >
            {question.icon}
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
          
          <RadioGroup
            value={currentValue || ""}
            onValueChange={onValueChange}
            className="gap-3 flex flex-col"
          >
            {question.options.map((option) => (
              <QuestionOption key={option} option={option} />
            ))}
          </RadioGroup>
          
          <Button
            onClick={onNext}
            disabled={isLoading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {!isLastQuestion ? (
              <>
                Next Question <ArrowRight className="ml-2 h-4 w-4" />
              </>
            ) : isLoading ? (
              "Saving..."
            ) : (
              "Complete & Start Free Trial"
            )}
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};
