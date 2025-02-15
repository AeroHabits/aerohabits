
import { AppHero } from "@/components/layout/AppHero";
import { WelcomeTour } from "@/components/WelcomeTour";
import { WelcomeQuiz } from "@/components/quiz/WelcomeQuiz";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { AppShowcase } from "@/components/showcase/AppShowcase";
import { UserMenu } from "@/components/UserMenu";

const Index = () => {
  const isMobile = useIsMobile();
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const checkQuizStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: quizResponse } = await supabase
          .from("user_quiz_responses")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        
        setShowQuiz(!quizResponse);
      }
    };

    checkQuizStatus();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <WelcomeTour />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "container mx-auto px-4 py-6 md:py-8 space-y-8 md:space-y-12",
          isMobile && "pb-24"
        )}
      >
        <div className="flex justify-between items-center">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300"
          >
            AEROHABITS
          </motion.h1>
          <UserMenu />
        </div>

        {showQuiz ? (
          <WelcomeQuiz />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-12"
          >
            <AppHero />
            <AppShowcase />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default Index;
