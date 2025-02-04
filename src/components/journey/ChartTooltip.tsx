import { motion } from "framer-motion";

interface ChartTooltipProps {
  active: boolean;
  payload: any[];
  day: string;
  completed: number;
  total: number;
  percentage: number;
}

export function ChartTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/20 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-white/30"
    >
      <p className="text-sm font-medium text-white">
        {data.day}
      </p>
      <p className="text-sm text-[#0EA5E9] font-medium">
        Completed: {data.completed}
      </p>
      <p className="text-sm text-white/80">
        Total: {data.total}
      </p>
      <div className="mt-1 pt-1 border-t border-white/10">
        <p className="text-sm font-medium text-white">
          {data.percentage}% Complete
        </p>
      </div>
    </motion.div>
  );
}