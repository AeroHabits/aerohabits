import { AddHabitForm } from "./AddHabitForm";
import { HabitListEmpty } from "./HabitListEmpty";
import { HabitListLoading } from "./HabitListLoading";
import { HabitStats } from "./HabitStats";
import { HabitListContent } from "./HabitListContent";
import { AIHabitCoach } from "./AIHabitCoach";
import { useHabits } from "@/hooks/useHabits";

export function HabitList() {
  const {
    habits,
    isLoading,
    habitToDelete,
    setHabitToDelete,
    deleteHabit,
    toggleHabit,
    addHabit,
  } = useHabits();

  if (isLoading) {
    return <HabitListLoading />;
  }

  if (habits.length === 0) {
    return <HabitListEmpty onAddHabit={addHabit} />;
  }

  const completedHabits = habits.filter(habit => habit.completed);
  const totalStreaks = habits.reduce((acc, habit) => acc + (habit.streak || 0), 0);

  return (
    <div className="space-y-8">
      <HabitStats 
        totalHabits={habits.length} 
        totalStreaks={totalStreaks}
        completedToday={completedHabits.length}
      />
      <AIHabitCoach habits={habits} />
      <HabitListContent
        habits={habits}
        onToggle={toggleHabit}
        onDelete={deleteHabit}
        setHabitToDelete={setHabitToDelete}
      />
      <div className="max-w-md mx-auto">
        <AddHabitForm onAddHabit={addHabit} />
      </div>
    </div>
  );
}