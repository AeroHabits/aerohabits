
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
      className="flex items-center space-x-3 bg-white border border-gray-200 hover:border-gray-300 transition-all p-4 rounded-lg cursor-pointer shadow-sm"
      onClick={() => onCheckedChange(option, !isChecked)}
    >
      <div className="flex justify-center items-center">
        <Checkbox 
          id={`${id}-${option}`}
          checked={isChecked}
          onCheckedChange={(checked) => onCheckedChange(option, checked === true)}
          className="text-gray-800 border-gray-400 data-[state=checked]:bg-gray-800 data-[state=checked]:text-white"
        />
      </div>
      <Label 
        htmlFor={`${id}-${option}`}
        className="text-gray-800 font-medium cursor-pointer w-full"
      >
        {option}
      </Label>
    </motion.div>
  );
}
