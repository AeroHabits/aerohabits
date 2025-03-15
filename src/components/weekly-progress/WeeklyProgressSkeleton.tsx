
import { Card } from "../ui/card";

export function WeeklyProgressSkeleton() {
  return (
    <Card className="p-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-white/10 shadow-2xl rounded-xl">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-800 rounded w-1/3"></div>
        <div className="h-4 bg-gray-800 rounded w-1/2"></div>
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-800 rounded"></div>
          ))}
        </div>
      </div>
    </Card>
  );
}
