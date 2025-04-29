
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
      className="flex items-center space-x-3 bg-slate-700/70 hover:bg-slate-600/80 border border-slate-600 hover:border-blue-500/50 transition-all p-4 rounded-lg cursor-pointer shadow-md group"
      onClick={() => onCheckedChange(option, !isChecked)}
    >
      <div className="flex justify-center items-center">
        <Checkbox 
          id={`${id}-${option}`}
          checked={isChecked}
          onCheckedChange={(checked) => onCheckedChange(option, checked === true)}
          className="border-blue-500/50 data-[state=checked]:bg-blue-500 data-[state=checked]:text-white group-hover:border-blue-400"
          onClick={(e) => e.stopPropagation()} 
        />
      </div>
      <Label 
        htmlFor={`${id}-${option}`}
        className="text-white font-medium cursor-pointer w-full"
        onClick={(e) => e.stopPropagation()} 
      >
        {option}
      </Label>
    </motion.div>
  );
}
