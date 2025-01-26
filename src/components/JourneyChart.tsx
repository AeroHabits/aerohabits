import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

interface JourneyChartProps {
  data: {
    day: string;
    completed: number;
  }[];
}

export function JourneyChart({ data }: JourneyChartProps) {
  const config = {
    completed: {
      label: "Completed Habits",
      theme: {
        light: "#8B5CF6",
        dark: "#8B5CF6",
      },
    },
  };

  return (
    <div className="h-[200px]">
      <ChartContainer config={config}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="day"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <ChartTooltip />
          <Area
            type="monotone"
            dataKey="completed"
            stroke="#8B5CF6"
            fillOpacity={1}
            fill="url(#completed)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}