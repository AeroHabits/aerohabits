import { AppHeader } from "@/components/layout/AppHeader";
import { AppHero } from "@/components/layout/AppHero";
import { AppTabs } from "@/components/layout/AppTabs";
import { WelcomeTour } from "@/components/WelcomeTour";
import { WelcomeQuiz } from "@/components/quiz/WelcomeQuiz";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-500/90 via-blue-600/80 to-indigo-600/90 overflow-x-hidden">
      <WelcomeTour />
      <div className={cn(
        "min-h-screen w-full py-4 md:py-8 space-y-6 md:space-y-8",
        isMobile ? "px-4 pb-24" : "container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      )}>
        <AppHeader />
        {showQuiz ? (
          <WelcomeQuiz />
        ) : (
          <>
            <AppHero />
            <AppTabs />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;