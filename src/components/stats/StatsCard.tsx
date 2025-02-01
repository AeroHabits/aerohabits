import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  value: number;
  subtitle: string;
  delay?: number;
}

export function StatsCard({ icon: Icon, iconColor, title, value, subtitle, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="p-6 bg-white/90 backdrop-blur-sm border-white/20 hover:shadow-lg transition-all">
        <div className="flex items-center space-x-4">
          <Icon className={`h-10 w-10 ${iconColor}`} />
          <div>
            <h3 className="font-semibold text-gray-700">{title}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}