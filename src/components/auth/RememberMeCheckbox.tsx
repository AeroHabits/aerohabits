
import { Checkbox } from "@/components/ui/checkbox";

interface RememberMeCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export const RememberMeCheckbox = ({ checked, onCheckedChange }: RememberMeCheckboxProps) => (
  <div className="flex items-center space-x-2">
    <Checkbox
      id="rememberMe"
      checked={checked}
      onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
    />
    <label
      htmlFor="rememberMe"
      className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
    >
      Remember me
    </label>
  </div>
);
