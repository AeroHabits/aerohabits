import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Brain, Heart, Sun, BookOpen, Award } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    id: 1,
    question: "What area of life would you like to focus on most?",
    options: ["Personal Growth", "Relationships", "Mental Wellness", "Life Balance"],
    icon: Brain,
  },
  {
    id: 2,
    question: "What's your primary goal for self-improvement?",
    options: ["Build Better Habits", "Develop New Skills", "Find Inner Peace", "Strengthen Connections"],
    icon: Award,
  },
  {
    id: 3,
    question: "How many days per week can you commit to personal development?",
    options: ["3-4 days", "4-5 days", "5-6 days", "Every day"],
    icon: Sun,
  },
  {
    id: 4,
    question: "How much time can you dedicate daily to self-improvement?",
    options: ["15-30 minutes", "30-45 minutes", "45-60 minutes", "60+ minutes"],
    icon: BookOpen,
  },
];

export function WelcomeQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleAnswer = async (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed, determine challenge difficulty
      const difficultyMap = {
        "Personal Growth": "medium",
        "Relationships": "medium",
        "Mental Wellness": "hard",
        "Life Balance": "master",
      };
      
      const focusArea = newAnswers[0];
      const difficulty = difficultyMap[focusArea as keyof typeof difficultyMap];
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error("Please sign in to save your quiz results");
          return;
        }

        // Get a random challenge of the determined difficulty
        const { data: challenges, error: challengeError } = await supabase
          .from("challenges")
          .select("id")
          .eq("difficulty", difficulty)
          .limit(1);

        if (challengeError) throw challengeError;

        if (challenges && challenges.length > 0) {
          const { error: responseError } = await supabase
            .from("user_quiz_responses")
            .insert({
              user_id: user.id,
              fitness_level: focusArea,
              goals: [newAnswers[1]],
              preferred_duration: parseInt(newAnswers[3]),
              recommended_challenge_id: challenges[0].id,
            });

          if (responseError) throw responseError;

          toast.success("Quiz completed! Redirecting to your recommended challenge...");
          navigate("/challenges");
        }
      } catch (error) {
        console.error("Error saving quiz responses:", error);
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const CurrentIcon = questions[currentQuestion].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-4"
    >
      <Card className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Welcome to AREOHABITS!</h2>
          <p className="text-muted-foreground">
            Let's discover your path to personal growth
          </p>
        </div>

        <div className="space-y-4">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center mb-4">
              <CurrentIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-center">
              {questions[currentQuestion].question}
            </h3>
            <div className="grid gap-3">
              {questions[currentQuestion].options.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  className="justify-between"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === currentQuestion
                    ? "bg-primary"
                    : index < currentQuestion
                    ? "bg-primary/30"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}