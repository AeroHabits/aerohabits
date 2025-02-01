import { useQuery } from "@tanstack/react-query";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { addDays, format, isSameDay, startOfDay } from "date-fns";
import { motion } from "framer-motion";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface CalendarData {
  date: Date;
  habits: number;
  completedHabits: number;
  challenges: number;
  goals: number;
}

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: calendarData } = useQuery({
    queryKey: ["calendar-data"],
    queryFn: async () => {
      const startDate = startOfDay(addDays(new Date(), -30)); // Fetch last 30 days
      
      const [habitsResponse, goalsResponse, challengesResponse] = await Promise.all([
        supabase
          .from("habits")
          .select("*")
          .gte("created_at", startDate.toISOString()),
        supabase
          .from("goals")
          .select("*")
          .gte("created_at", startDate.toISOString()),
        supabase
          .from("user_challenges")
          .select(`
            *,
            challenge_completions (*)
          `)
          .gte("created_at", startDate.toISOString())
      ]);

      if (habitsResponse.error) throw habitsResponse.error;
      if (goalsResponse.error) throw goalsResponse.error;
      if (challengesResponse.error) throw challengesResponse.error;

      const calendarMap = new Map<string, CalendarData>();

      // Process habits
      habitsResponse.data.forEach(habit => {
        const date = startOfDay(new Date(habit.created_at));
        const dateKey = date.toISOString();
        
        if (!calendarMap.has(dateKey)) {
          calendarMap.set(dateKey, {
            date,
            habits: 0,
            completedHabits: 0,
            challenges: 0,
            goals: 0
          });
        }
        
        const data = calendarMap.get(dateKey)!;
        data.habits++;
        if (habit.completed) {
          data.completedHabits++;
        }
      });

      // Process goals
      goalsResponse.data.forEach(goal => {
        const date = startOfDay(new Date(goal.created_at));
        const dateKey = date.toISOString();
        
        if (!calendarMap.has(dateKey)) {
          calendarMap.set(dateKey, {
            date,
            habits: 0,
            completedHabits: 0,
            challenges: 0,
            goals: 0
          });
        }
        
        const data = calendarMap.get(dateKey)!;
        data.goals++;
      });

      // Process challenges
      challengesResponse.data.forEach(challenge => {
        const date = startOfDay(new Date(challenge.created_at));
        const dateKey = date.toISOString();
        
        if (!calendarMap.has(dateKey)) {
          calendarMap.set(dateKey, {
            date,
            habits: 0,
            completedHabits: 0,
            challenges: 0,
            goals: 0
          });
        }
        
        const data = calendarMap.get(dateKey)!;
        data.challenges++;
      });

      return Array.from(calendarMap.values());
    }
  });

  const selectedDayData = calendarData?.find(data => 
    isSameDay(data.date, selectedDate)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/90 via-blue-600/80 to-indigo-600/90">
      <div className="container py-8 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white tracking-tight drop-shadow-lg">
            Calendar
          </h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 bg-white/95">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md"
              modifiers={{
                hasActivity: (date) => 
                  calendarData?.some(data => 
                    isSameDay(data.date, date) && 
                    (data.habits > 0 || data.challenges > 0 || data.goals > 0)
                  ) || false
              }}
              modifiersStyles={{
                hasActivity: {
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  fontWeight: "bold"
                }
              }}
            />
          </Card>

          <Card className="p-6 bg-white/95">
            <h2 className="text-2xl font-semibold mb-4">
              {format(selectedDate, "MMMM d, yyyy")}
            </h2>
            {selectedDayData ? (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {selectedDayData.habits > 0 && (
                    <Badge variant="secondary" className="text-sm">
                      {selectedDayData.completedHabits}/{selectedDayData.habits} Habits Completed
                    </Badge>
                  )}
                  {selectedDayData.challenges > 0 && (
                    <Badge variant="secondary" className="text-sm">
                      {selectedDayData.challenges} Active Challenges
                    </Badge>
                  )}
                  {selectedDayData.goals > 0 && (
                    <Badge variant="secondary" className="text-sm">
                      {selectedDayData.goals} Goals Set
                    </Badge>
                  )}
                </div>
                {selectedDayData.habits + selectedDayData.challenges + selectedDayData.goals === 0 && (
                  <p className="text-gray-500">No activity on this day</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No activity on this day</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;