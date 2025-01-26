import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export function AIInsights() {
  const { data: habits } = useQuery({
    queryKey: ["habits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: analysis, isLoading } = useQuery({
    queryKey: ["habits-analysis", habits?.length],
    queryFn: async () => {
      if (!habits?.length) return null;
      
      const { data } = await supabase.functions.invoke('analyze-habits', {
        body: { habits },
      });
      
      return data.analysis;
    },
    enabled: !!habits?.length,
  });

  if (!habits?.length || isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 bg-white/90 backdrop-blur-sm border-white/20">
        <div className="flex items-start space-x-4">
          <Sparkles className="h-6 w-6 text-purple-500 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Insights</h3>
            <p className="text-gray-700">{analysis}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}