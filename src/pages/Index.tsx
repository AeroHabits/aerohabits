
import { AppHero } from "@/components/layout/AppHero";
import { AppTabs } from "@/components/layout/AppTabs";
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
          "container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8",
          isMobile && "pb-24"
        )}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
            AEROHABITS
          </h1>
          <UserMenu />
        </div>

        {showQuiz ? (
          <WelcomeQuiz />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AppHero />
            <AppShowcase />
            <AppTabs />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Index;
