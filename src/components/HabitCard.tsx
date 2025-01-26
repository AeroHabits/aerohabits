import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle } from "lucide-react";
import { NotificationPreferences } from "./NotificationPreferences";

interface HabitCardProps {
  id: number;
  title: string;
  description: string;
  streak: number;
  completed: boolean;
  onToggle: () => void;
}

export function HabitCard({ id, title, description, streak, completed, onToggle }: HabitCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow animate-fade-in bg-white/70 backdrop-blur-sm border-[#D3E4FD]/50 hover:border-[#33C3F0]/60">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onToggle}
        >
          {completed ? (
            <CheckCircle2 className="h-6 w-6 text-[#33C3F0]" />
          ) : (
            <Circle className="h-6 w-6" />
          )}
        </Button>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span className="font-medium">{streak} day streak</span>
        <NotificationPreferences habitId={id} />
      </div>
    </Card>
  );
}