import { HabitCard } from "./HabitCard";
import { useState } from "react";

export function HabitList() {
  const [habits, setHabits] = useState([
    {
      id: 1,
      title: "Read 20 pages",
      description: "Daily reading habit",
      streak: 5,
      completed: false,
    },
    {
      id: 2,
      title: "Meditate",
      description: "10 minutes of mindfulness",
      streak: 3,
      completed: false,
    },
    {
      id: 3,
      title: "Exercise",
      description: "30 minutes workout",
      streak: 7,
      completed: false,
    },
  ]);

  const toggleHabit = (id: number) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          title={habit.title}
          description={habit.description}
          streak={habit.streak}
          completed={habit.completed}
          onToggle={() => toggleHabit(habit.id)}
        />
      ))}
    </div>
  );
}