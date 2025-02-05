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
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1A1F2C] via-[#2C1F3C] to-[#1F2C3C]">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              "radial-gradient(circle at 0% 0%, rgba(155, 135, 245, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 100%, rgba(126, 105, 171, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 0% 100%, rgba(155, 135, 245, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 100% 0%, rgba(126, 105, 171, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/5 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                scale: [1, 1.5, 1],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          ))}
        </div>
      </div>

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