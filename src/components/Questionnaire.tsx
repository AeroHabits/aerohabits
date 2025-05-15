import { useState, memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface QuestionItem {
  id: string;
  question: string;
  options: string[];
  icon?: React.ReactNode;
  allowMultiple?: boolean;
}

interface QuestionnaireProps {
  questions: QuestionItem[];
  onComplete: (answers: Record<string, string[]>) => void;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
}

const QuestionOption = memo(({ 
  id, 
  option, 
  isChecked, 
  onCheckedChange 
}: { 
  id: string; 
  option: string; 
  isChecked: boolean; 
  onCheckedChange: (value: string, checked: boolean) => void;
}) => {
  return (
    <motion.div
      key={option}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center space-x-3 bg-slate-700/70 hover:bg-slate-600/80 border border-slate-600 hover:border-blue-500/50 transition-all p-4 rounded-lg cursor-pointer shadow-md group"
      onClick={() => onCheckedChange(option, !isChecked)}
    >
      <Checkbox 
        id={`${id}-${option}`}
        checked={isChecked}
        onCheckedChange={(checked) => onCheckedChange(option, checked === true)}
        className="border-blue-500/50 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white group-hover:border-blue-400"
        onClick={(e) => e.stopPropagation()} 
      />
      <Label 
        htmlFor={`${id}-${option}`}
        className="text-white font-medium cursor-pointer w-full"
        onClick={(e) => e.stopPropagation()} 
      >
        {option}
      </Label>
    </motion.div>
  );
});

QuestionOption.displayName = 'QuestionOption';

export function Questionnaire({ 
  questions, 
  onComplete,
  title = "Questionnaire",
  subtitle = "Please answer the following questions",
  isLoading = false
}: QuestionnaireProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleAnswerChange = useCallback((value: string, checked: boolean) => {
    setAnswers(prev => {
      const currentAnswers = prev[currentQuestion.id] || [];
      
      if (checked) {
        if (currentQuestion.allowMultiple === false && currentAnswers.length > 0) {
          // If multiple selection is not allowed, replace the current answer
          return {
            ...prev,
            [currentQuestion.id]: [value]
          };
        } else {
          // Otherwise, add to the existing answers
          return {
            ...prev,
            [currentQuestion.id]: [...currentAnswers, value]
          };
        }
      } else {
        // Remove the value if it's unchecked
        return {
          ...prev,
          [currentQuestion.id]: currentAnswers.filter(item => item !== value)
        };
      }
    });
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    if (!answers[currentQuestion.id] || answers[currentQuestion.id].length === 0) {
      toast.error("Selection required", {
        description: "Please select at least one option to continue"
      });
      return;
    }

    if (isLastQuestion) {
      onComplete(answers);
    } else {
      setCurrentQuestionIndex(current => current + 1);
    }
  }, [currentQuestion.id, answers, isLastQuestion, onComplete]);

  return (
    <div className="max-w-lg mx-auto pt-8 px-4">
      <div className="text-center mb-6">
        <motion.h1 
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="text-blue-100/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {subtitle}
        </motion.p>
        
        <motion.div 
          className="w-full h-2 bg-slate-700 rounded-full mt-6"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="h-full bg-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </motion.div>
        
        <motion.p
          className="text-sm text-slate-400 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Question {currentQuestionIndex + 1} of {questions.length}
        </motion.p>
      </div>
      
      <Card className="bg-slate-800/80 border-slate-700/50 backdrop-blur-sm shadow-xl">
        <CardContent className="pt-6 space-y-6">
          {currentQuestion?.icon && (
            <motion.div
              key={currentQuestion.id + "-icon"}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center justify-center mb-4"
            >
              <div className="p-3 bg-slate-700/70 rounded-full border border-slate-600">
                {currentQuestion.icon}
              </div>
            </motion.div>
          )}
          
          <motion.div
            key={currentQuestion?.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <Label className="text-lg text-white text-center block">
              {currentQuestion?.question}
            </Label>
            
            <div className="gap-3 flex flex-col mt-4">
              {currentQuestion?.options.map((option) => (
                <QuestionOption 
                  key={option}
                  id={currentQuestion.id}
                  option={option}
                  isChecked={(answers[currentQuestion.id] || []).includes(option)}
                  onCheckedChange={handleAnswerChange}
                />
              ))}
            </div>
            
            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 text-white mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : isLastQuestion ? (
                "Complete"
              ) : (
                <>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
