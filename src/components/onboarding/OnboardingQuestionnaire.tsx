
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ArrowRight, ListChecks, Target, Clock, Heart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuthForm } from "@/hooks/useAuthForm";

const questions = [
  {
    id: "primary_goal",
    question: "What is your primary goal in life right now?",
    placeholder: "e.g., Career growth, better health, learning new skills...",
    icon: <Target className="w-6 h-6 text-purple-500" />,
  },
  {
    id: "biggest_challenge",
    question: "What's your biggest challenge in building consistent habits?",
    placeholder: "e.g., Lack of time, staying motivated, tracking progress...",
    icon: <ListChecks className="w-6 h-6 text-blue-500" />,
  },
  {
    id: "time_commitment",
    question: "How much time can you commit daily to your habits?",
    placeholder: "e.g., 15 minutes, 30 minutes, 1 hour...",
    icon: <Clock className="w-6 h-6 text-emerald-500" />,
  },
  {
    id: "motivation",
    question: "What motivates you most to achieve your goals?",
    placeholder: "e.g., Family, personal growth, recognition...",
    icon: <Heart className="w-6 h-6 text-rose-500" />,
  },
];

export function OnboardingQuestionnaire() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { isLoading, setIsLoading, handleError } = useAuthForm();

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: e.target.value,
    });
  };

  const startSubscriptionFlow = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if user already has a subscription
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('subscription_status, is_subscribed')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // If user already has an active subscription, redirect to home
        if (profile?.is_subscribed || profile?.subscription_status === 'active') {
          navigate('/habits');
          return;
        }

        // Create checkout session with trial period enabled
        const { data, error } = await supabase.functions.invoke('create-checkout-session', {
          body: {
            priceId: 'price_1Qsw84LDj4yzbQfIQkQ8igHs',
            returnUrl: window.location.origin + '/habits',
            includeTrialPeriod: true
          }
        });
        
        if (error) throw error;
        window.location.href = data.url;
      } else {
        throw new Error("User not authenticated");
      }
    } catch (error) {
      console.error("Error starting subscription:", error);
      handleError(error);
      navigate('/premium'); // Fallback to premium page if checkout fails
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (!answers[currentQuestion.id]?.trim()) {
      toast.error("Please provide an answer before continuing");
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Save answers to the profile's metadata
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Update the profile with the questionnaire answers
          const { error } = await supabase
            .from('profiles')
            .update({
              updated_at: new Date().toISOString(),
              full_name: user.user_metadata.full_name || ''
            })
            .eq('id', user.id);
          
          if (error) throw error;
          
          // Store questionnaire answers in user quiz responses instead
          const { error: quizError } = await supabase
            .from('user_quiz_responses')
            .insert({
              user_id: user.id,
              fitness_level: answers.time_commitment || 'beginner',
              goals: [answers.primary_goal || 'general'],
              preferred_duration: parseInt(answers.time_commitment) || 15
            });
            
          if (quizError) {
            console.error("Error saving quiz responses:", quizError);
            // Continue anyway since this is not critical
          }
          
          // Redirect to subscription flow with trial
          startSubscriptionFlow();
        } else {
          throw new Error("User not authenticated");
        }
      } catch (error) {
        console.error("Error saving answers:", error);
        handleError(error);
      }
    }
  };

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
            Let's personalize your experience ({currentQuestionIndex + 1}/{questions.length})
          </p>
          <div className="flex gap-1 justify-center mt-4">
            {questions.map((_, index) => (
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

        <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-center mb-4">
              <motion.div
                key={currentQuestion.id + "-icon"}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-3 bg-gray-700/50 rounded-full"
              >
                {currentQuestion.icon}
              </motion.div>
            </div>
            
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <Label className="text-lg text-white text-center block">
                {currentQuestion.question}
              </Label>
              
              <Input
                value={answers[currentQuestion.id] || ""}
                onChange={handleAnswerChange}
                placeholder={currentQuestion.placeholder}
                className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400"
              />
              
              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              >
                {currentQuestionIndex < questions.length - 1 ? (
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
      </motion.div>
    </div>
  );
}
