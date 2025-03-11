
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HabitListErrorProps {
  onRefresh: () => Promise<void>;
  refreshing: boolean;
}

export function HabitListError({ onRefresh, refreshing }: HabitListErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">Unable to load habits</h3>
      <p className="text-blue-100 mb-6">
        We encountered a problem loading your habits. This could be due to network issues.
      </p>
      <Button 
        onClick={onRefresh} 
        variant="outline"
        className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
        Try Again
      </Button>
    </div>
  );
}
