import { useQuery } from "@tanstack/react-query";
import { Card } from "./ui/card";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export function AIInsights({ habits }: { habits: any[] }) {
  const { data: analysis, isLoading } = useQuery({
    queryKey: ["habits-analysis", habits.length],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("analyze-habits", {
        body: { habits },
      });

      if (error) {
        console.error("Error analyzing habits:", error);
        throw error;
      }

      return data.analysis;
    },
    enabled: habits.length > 0,
  });

  if (isLoading || !analysis) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white/90 backdrop-blur-sm border-white/20">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            <p className="text-sm text-gray-600">
              Here's what our AI assistant thinks about your progress
            </p>
          </div>
          <p className="text-gray-700">{analysis}</p>
        </div>
      </Card>
    </motion.div>
  );
}