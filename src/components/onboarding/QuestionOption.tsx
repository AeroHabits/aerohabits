
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface QuestionOptionProps {
  id: string;
  option: string;
  isChecked: boolean;
  onCheckedChange: (value: string, checked: boolean) => void;
}

export function QuestionOption({ id, option, isChecked, onCheckedChange }: QuestionOptionProps) {
  return (
    <motion.div
      key={option}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex items-center space-x-3 bg-[#2A2F3C]/70 hover:bg-[#323744]/80 border border-[#403E43] hover:border-[#9b87f5]/50 transition-all p-4 rounded-lg cursor-pointer shadow-md group"
      onClick={() => onCheckedChange(option, !isChecked)}
    >
      <div className="flex justify-center items-center">
        <Checkbox 
          id={`${id}-${option}`}
          checked={isChecked}
          onCheckedChange={(checked) => onCheckedChange(option, checked === true)}
          className="border-[#9b87f5]/50 data-[state=checked]:bg-[#9b87f5] data-[state=checked]:text-white group-hover:border-[#9b87f5]"
          onClick={(e) => e.stopPropagation()} // Prevent triggering parent click when clicking directly on checkbox
        />
      </div>
      <Label 
        htmlFor={`${id}-${option}`}
        className="text-white font-medium cursor-pointer w-full"
        onClick={(e) => e.stopPropagation()} // Prevent triggering parent click when clicking directly on label
      >
        {option}
      </Label>
    </motion.div>
  );
}
