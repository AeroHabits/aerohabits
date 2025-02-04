import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { ChartGradients } from "./journey/ChartGradients";
import { ChartTooltip as CustomTooltip } from "./journey/ChartTooltip";

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
        light: "#94A3B8",
        dark: "#94A3B8",
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
            <ChartGradients />
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#FFFFFF" 
              opacity={0.3}
              className="animate-fade-in" 
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
            
            <ChartTooltip content={CustomTooltip} />
            
            <Area
              type="monotone"
              dataKey="total"
              stroke="#94A3B8"
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