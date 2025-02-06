
import { AppHeader } from "@/components/layout/AppHeader";
import { AppHero } from "@/components/layout/AppHero";
import { AppTabs } from "@/components/layout/AppTabs";
import { WelcomeTour } from "@/components/WelcomeTour";
import { WelcomeQuiz } from "@/components/quiz/WelcomeQuiz";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

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
          "relative min-h-screen w-full py-4 md:py-8 space-y-6 md:space-y-8",
          isMobile ? "px-4" : "container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        )}
      >
        <AppHeader />
        {showQuiz ? (
          <WelcomeQuiz />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AppHero />
            <AppTabs />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Index;

