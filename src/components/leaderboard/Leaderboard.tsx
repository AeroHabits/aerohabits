
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Trophy, Crown, Medal } from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardEntry {
  id: string;
  username: string;
  points: number;
  is_bot: boolean;
}

export function Leaderboard() {
  const { data: leaderboardData } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leaderboard")
        .select("*")
        .order("points", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as LeaderboardEntry[];
    },
  });

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return <Trophy className="h-5 w-5 text-blue-500 opacity-50" />;
    }
  };

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Leaderboard
      </h2>
      <div className="space-y-4">
        {leaderboardData?.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="text-white/80 font-medium w-8">#{index + 1}</span>
              {getRankIcon(index)}
              <span className="text-white font-semibold">{entry.username}</span>
              {entry.is_bot && (
                <span className="text-xs text-white/50 px-2 py-1 rounded-full bg-white/10">
                  BOT
                </span>
              )}
            </div>
            <span className="text-white font-bold">{entry.points} pts</span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
