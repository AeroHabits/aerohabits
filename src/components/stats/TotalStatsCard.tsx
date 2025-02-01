import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface TotalStatsCardProps {
  title: string;
  value: string | number;
  description: string;
  delay?: number;
}

export function TotalStatsCard({ title, value, description, delay = 0 }: TotalStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="p-6 bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900">{value}</h3>
          <p className="text-gray-600">{title}</p>
          <p className="text-sm text-gray-500 mt-2">{description}</p>
        </div>
      </Card>
    </motion.div>
  );
}