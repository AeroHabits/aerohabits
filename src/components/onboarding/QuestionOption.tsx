
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
      className="flex items-center space-x-3 bg-gradient-to-r from-white/20 to-white/5 hover:from-white/30 hover:to-white/10 border border-white/30 transition-all p-4 rounded-lg cursor-pointer shadow-md"
      onClick={() => onCheckedChange(option, !isChecked)}
    >
      <div className="flex justify-center items-center">
        <Checkbox 
          id={`${id}-${option}`}
          checked={isChecked}
          onCheckedChange={(checked) => onCheckedChange(option, checked === true)}
          className="text-white border-white/70 data-[state=checked]:bg-white data-[state=checked]:text-gray-800"
        />
      </div>
      <Label 
        htmlFor={`${id}-${option}`}
        className="text-white font-medium cursor-pointer w-full"
      >
        {option}
      </Label>
    </motion.div>
  );
}
