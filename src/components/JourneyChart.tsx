
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
        light: "#3B82F6",
        dark: "#3B82F6",
      },
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-lg p-6 rounded-xl shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-300 h-[200px]"
    >
      <ChartContainer config={config}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#FFFFFF" 
              opacity={0.2}
            />
            
            <XAxis
              dataKey="day"
              stroke="#FFFFFF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
              tick={{ fill: '#FFFFFF' }}
            />
            
            <YAxis
              stroke="#FFFFFF"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              dx={-10}
              tick={{ fill: '#FFFFFF' }}
            />
            
            <ChartTooltip content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              
              const data = payload[0].payload;
              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-lg p-3 rounded-lg shadow-xl border border-white/30"
                >
                  <p className="font-medium text-white">{data.day}</p>
                  <p className="text-blue-300">
                    Completed: {data.completed}
                  </p>
                </motion.div>
              );
            }} />
            
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#3B82F6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#completed)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </motion.div>
  );
}
