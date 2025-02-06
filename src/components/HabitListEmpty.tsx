
import { AddHabitForm } from "./AddHabitForm";

interface HabitListEmptyProps {
  onAddHabit: (habit: { title: string; description: string; category?: string }) => void;
}

export function HabitListEmpty({ onAddHabit }: HabitListEmptyProps) {
  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">No habits yet</h2>
        <p className="text-gray-800 font-medium">Start by adding your first habit below.</p>
      </div>
      <div className="max-w-md mx-auto">
        <AddHabitForm onAddHabit={onAddHabit} />
      </div>
    </div>
  );
}

