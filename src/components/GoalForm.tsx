import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface GoalFormProps {
  onGoalAdded: () => void;
}

export function GoalForm({ onGoalAdded }: GoalFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date>();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a goal title",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await supabase
      .from('goals')
      .insert([
        { 
          title, 
          description,
          target_date: date?.toISOString(),
          status: 'in_progress'
        }
      ]);

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setTitle("");
    setDescription("");
    setDate(undefined);
    onGoalAdded();
    
    toast({
      title: "Success",
      description: "New goal added successfully!",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white/70 backdrop-blur-sm rounded-lg border border-[#D3E4FD]/50">
      <div className="space-y-2">
        <Input
          placeholder="Enter goal title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-[#D3E4FD]/50 focus:border-[#33C3F0]/60"
        />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Enter goal description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-[#D3E4FD]/50 focus:border-[#33C3F0]/60"
        />
      </div>
      <div className="space-y-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a target date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button 
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-[#F97316] via-[#D946EF] to-[#0EA5E9] text-white hover:opacity-90"
      >
        {isLoading ? "Adding..." : "Add New Goal"}
      </Button>
    </form>
  );
}