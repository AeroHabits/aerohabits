
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface QuestionOptionProps {
  questionId: string;
  option: string;
  isChecked: boolean;
  onCheckedChange: (value: string, checked: boolean) => void;
}

export function QuestionOption({
  questionId,
  option,
  isChecked,
  onCheckedChange,
}: QuestionOptionProps) {
  return (
    <div className="flex items-center space-x-3 bg-gray-700/30 hover:bg-gray-700/50 transition-colors p-3 rounded-lg cursor-pointer">
      <Checkbox 
        id={`${questionId}-${option}`}
        checked={isChecked}
        onCheckedChange={(checked) => onCheckedChange(option, checked === true)}
        className="text-purple-500 border-gray-500 data-[state=checked]:bg-purple-600 data-[state=checked]:text-white"
      />
      <Label 
        htmlFor={`${questionId}-${option}`}
        className="text-white font-medium cursor-pointer w-full"
      >
        {option}
      </Label>
    </div>
  );
}
