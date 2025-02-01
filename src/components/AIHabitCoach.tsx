import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Brain, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Habit } from "@/types";

interface AIHabitCoachProps {
  habits: Habit[];
}

export function AIHabitCoach({ habits }: AIHabitCoachProps) {
  const [coaching, setCoaching] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getCoaching = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase.functions.invoke('habit-coach', {
        body: { habits, userId: user.id },
      });

      if (error) throw error;
      setCoaching(data.coaching);
    } catch (error) {
      console.error('Error getting coaching:', error);
      toast({
        title: "Error",
        description: "Failed to get AI coaching. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-900">AI Habit Coach</h2>
          </div>
          <Button
            onClick={getCoaching}
            disabled={isLoading}
            className="bg-purple-500 hover:bg-purple-600"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Get Coaching
          </Button>
        </div>

        {coaching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="prose prose-purple max-w-none"
          >
            <div className="whitespace-pre-wrap text-gray-700">
              {coaching}
            </div>
          </motion.div>
        )}

        {!coaching && !isLoading && (
          <p className="text-gray-500 text-center">
            Click the button above to get personalized AI coaching based on your habits!
          </p>
        )}
      </Card>
    </motion.div>
  );
}