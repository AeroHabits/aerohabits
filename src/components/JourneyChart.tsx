
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
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
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 backdrop-blur-lg p-6 rounded-xl shadow-2xl border border-white/20 hover:border-white/30 transition-all duration-300 h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#FFFFFF" 
            opacity={0.1}
          />
          
          <XAxis
            dataKey="day"
            stroke="#FFFFFF"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#FFFFFF', opacity: 0.5 }}
            dy={10}
            tick={{ fill: '#FFFFFF', opacity: 0.8 }}
          />
          
          <YAxis
            stroke="#FFFFFF"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#FFFFFF', opacity: 0.5 }}
            dx={-10}
            tick={{ fill: '#FFFFFF', opacity: 0.8 }}
          />
          
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              
              const data = payload[0].payload;
              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/90 p-3 rounded-lg shadow-xl border border-blue-200 text-gray-800"
                >
                  <p className="font-medium">{data.day}</p>
                  <p className="text-blue-600">
                    Completed: {data.completed} / {data.total}
                  </p>
                </motion.div>
              );
            }}
          />
          
          <Bar
            dataKey="completed"
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
