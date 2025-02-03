import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    id: 1,
    question: "What's your current fitness level?",
    options: ["Beginner", "Intermediate", "Advanced", "Elite"],
  },
  {
    id: 2,
    question: "What's your primary fitness goal?",
    options: ["Weight Loss", "Muscle Gain", "Endurance", "Overall Health"],
  },
  {
    id: 3,
    question: "How many days per week can you commit to?",
    options: ["3-4 days", "4-5 days", "5-6 days", "Every day"],
  },
  {
    id: 4,
    question: "What's your preferred workout duration?",
    options: ["15-30 minutes", "30-45 minutes", "45-60 minutes", "60+ minutes"],
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
        Beginner: "medium",
        Intermediate: "medium",
        Advanced: "hard",
        Elite: "master",
      };
      
      const fitnessLevel = newAnswers[0];
      const difficulty = difficultyMap[fitnessLevel as keyof typeof difficultyMap];
      
      try {
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
              fitness_level: fitnessLevel,
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
            Let's find the perfect challenge for you
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
            <h3 className="text-xl font-semibold">
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