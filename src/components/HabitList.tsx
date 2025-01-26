import { HabitCard } from "./HabitCard";
import { AddHabitForm } from "./AddHabitForm";
import { useState } from "react";

interface Habit {
  id: number;
  title: string;
  description: string;
  streak: number;
  completed: boolean;
  category?: string;
}

export function HabitList() {
  const [habits, setHabits] = useState<Habit[]>([
    {
      id: 1,
      title: "Read 5 pages",
      description: "Daily reading habit",
      streak: 5,
      completed: false,
      category: "Learning"
    },
    {
      id: 2,
      title: "Meditate",
      description: "10 minutes of mindfulness",
      streak: 3,
      completed: false,
      category: "Self Mastery"
    },
    {
      id: 3,
      title: "Exercise",
      description: "30 minutes workout",
      streak: 7,
      completed: false,
      category: "Health & Fitness"
    },
  ]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const addHabit = ({ title, description, category }: { title: string; description: string; category?: string }) => {
    const newHabit: Habit = {
      id: habits.length + 1,
      title,
      description,
      streak: 0,
      completed: false,
      category,
    };
    setHabits([...habits, newHabit]);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            id={habit.id}
            title={habit.title}
            description={habit.description}
            streak={habit.streak}
            completed={habit.completed}
            onToggle={() => toggleHabit(habit.id)}
          />
        ))}
      </div>
      <div className="max-w-md mx-auto">
        <AddHabitForm onAddHabit={addHabit} />
      </div>
    </div>
  );
}