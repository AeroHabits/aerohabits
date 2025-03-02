
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
    <div 
      key={option} 
      className="flex items-center space-x-3 bg-gray-700/30 hover:bg-gray-700/50 transition-colors p-3 rounded-lg cursor-pointer"
    >
      <Checkbox 
        id={`${id}-${option}`}
        checked={isChecked}
        onCheckedChange={(checked) => onCheckedChange(option, checked === true)}
        className="text-purple-500 border-gray-500 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
      />
      <Label 
        htmlFor={`${id}-${option}`}
        className="text-white font-medium cursor-pointer w-full"
      >
        {option}
      </Label>
    </div>
  );
}
