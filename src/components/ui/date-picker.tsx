
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full pl-3 text-left font-normal bg-slate-800/80 border-slate-700/80 hover:border-indigo-500/50 text-white hover:bg-slate-800/95 hover:text-white py-6 h-auto rounded-xl",
            !date && "text-gray-400"
          )}
        >
          <div className="flex items-center">
            <CalendarIcon className="mr-2 h-5 w-5 text-indigo-400" />
            {date ? format(date, "PPP") : <span>Select a target date</span>}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700 text-white">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          className="bg-slate-800 text-white"
        />
      </PopoverContent>
    </Popover>
  );
}
