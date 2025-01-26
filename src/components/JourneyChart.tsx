import { Card } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", completed: 3 },
  { day: "Tue", completed: 4 },
  { day: "Wed", completed: 2 },
  { day: "Thu", completed: 5 },
  { day: "Fri", completed: 3 },
  { day: "Sat", completed: 4 },
  { day: "Sun", completed: 5 },
];

const config = {
  completed: {
    label: "Completed Habits",
    theme: {
      light: "#33C3F0",
      dark: "#33C3F0",
    },
  },
};

export function JourneyChart() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Weekly Progress</h3>
          <p className="text-sm text-muted-foreground">
            Your habit completion over the past week
          </p>
        </div>
        <div className="h-[200px]">
          <ChartContainer config={config}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="completed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#33C3F0" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#33C3F0" stopOpacity={0} />
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
                stroke="#33C3F0"
                fillOpacity={1}
                fill="url(#completed)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>
    </Card>
  );
}