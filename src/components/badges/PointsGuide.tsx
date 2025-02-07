
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Trophy, Flame, Star, Award, Crown } from "lucide-react";
import { motion } from "framer-motion";

interface PointsGuideItem {
  id: string;
  title: string;
  description: string;
  points_value: number | null;
  category: 'earning' | 'spending';
  display_order: number;
  icon: string;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Trophy':
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 'Flame':
      return <Flame className="h-5 w-5 text-orange-500" />;
    case 'Star':
      return <Star className="h-5 w-5 text-blue-500" />;
    case 'Award':
      return <Award className="h-5 w-5 text-purple-500" />;
    case 'Crown':
      return <Crown className="h-5 w-5 text-amber-500" />;
    default:
      return <Star className="h-5 w-5 text-gray-500" />;
  }
};

export function PointsGuide() {
  const { data: pointsGuide } = useQuery({
    queryKey: ["points-guide"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("points_guide")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as PointsGuideItem[];
    },
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {pointsGuide?.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 bg-white/5 hover:bg-white/10 transition-all duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-white/10">
                  {getIcon(item.icon)}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    {item.title}
                    {item.points_value && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
                        {item.points_value} pts
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-white/70 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
