import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";

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
        dark: "#60A5FA",
      },
    },
    total: {
      label: "Total Habits",
      theme: {
        light: "#E2E8F0",
        dark: "#475569",
      },
    },
  };

  return (
    <div className="h-[200px]">
      <ChartContainer config={config}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E2E8F0" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#E2E8F0" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.3} />
            
            <XAxis
              dataKey="day"
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            
            <YAxis
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
              dx={-10}
            />
            
            <ChartTooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {payload[0].payload.day}
                      </p>
                      <p className="text-sm text-blue-600">
                        Completed: {payload[0].payload.completed}
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: {payload[0].payload.total}
                      </p>
                      <p className="text-sm font-medium text-indigo-600">
                        {payload[0].payload.percentage}% Complete
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Area
              type="monotone"
              dataKey="total"
              stroke="#E2E8F0"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#total)"
            />
            
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
    </div>
  );
}