
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
  const handleOptionClick = () => {
    onCheckedChange(option, !isChecked);
  };

  return (
    <motion.div
      key={option}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex items-center space-x-3 bg-gradient-to-r from-gray-800/80 to-gray-800/40 hover:from-gray-700/80 hover:to-gray-700/40 border border-gray-700/50 transition-all p-4 rounded-lg cursor-pointer shadow-md"
      onClick={handleOptionClick}
    >
      <div className="flex justify-center items-center">
        <Checkbox 
          id={`${id}-${option}`}
          checked={isChecked}
          onCheckedChange={(checked) => onCheckedChange(option, checked === true)}
          className="text-cyan-500 border-cyan-400/50 data-[state=checked]:bg-cyan-600 data-[state=checked]:text-white"
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
