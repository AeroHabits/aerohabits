import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

interface JourneyChartProps {
  data: {
    day: string;
    completed: number;
    total: number;
    percentage: number;
  }[];
}

export function JourneyChart({ data }: JourneyChartProps) {
  const config = {
    completed: {
      label: "Completed Habits",
      theme: {
        light: "#0EA5E9",
        dark: "#0EA5E9",
      },
    },
    total: {
      label: "Total Habits",
      theme: {
        light: "#E5E7EB",
        dark: "#374151",
      },
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="h-[200px]"
    >
      <ChartContainer config={config}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E5E7EB" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#E5E7EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#E2E8F0" 
              opacity={0.2}
              className="animate-fade-in" 
            />
            
            <XAxis
              dataKey="day"
              stroke="#000000"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fill: '#000000' }}
            />
            
            <YAxis
              stroke="#000000"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              dx={-10}
              tick={{ fill: '#000000' }}
            />
            
            <ChartTooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-[#0EA5E9]/20"
                    >
                      <p className="text-sm font-medium text-black">
                        {payload[0].payload.day}
                      </p>
                      <p className="text-sm text-[#0EA5E9] font-medium">
                        Completed: {payload[0].payload.completed}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: {payload[0].payload.total}
                      </p>
                      <div className="mt-1 pt-1 border-t border-[#0EA5E9]/10">
                        <p className="text-sm font-medium text-black">
                          {payload[0].payload.percentage}% Complete
                        </p>
                      </div>
                    </motion.div>
                  );
                }
                return null;
              }}
            />
            
            <Area
              type="monotone"
              dataKey="total"
              stroke="#E5E7EB"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#total)"
              className="animate-fade-in"
            />
            
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#0EA5E9"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#completed)"
              className="animate-fade-in"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </motion.div>
  );
}