
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface QuestionOptionProps {
  option: string;
}

export const QuestionOption = ({ option }: QuestionOptionProps) => {
  return (
    <div 
      key={option} 
      className="flex items-center space-x-2 bg-gray-700/30 hover:bg-gray-700/50 transition-colors p-3 rounded-lg cursor-pointer"
    >
      <RadioGroupItem 
        value={option} 
        id={option} 
        className="text-purple-500"
      />
      <Label 
        htmlFor={option} 
        className="text-white font-medium cursor-pointer w-full"
      >
        {option}
      </Label>
    </div>
  );
};
