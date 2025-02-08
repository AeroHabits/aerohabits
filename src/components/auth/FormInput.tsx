
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
}

export const FormInput = ({
  id,
  label,
  type,
  value,
  onChange,
  required = false,
  disabled = false,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-white text-lg font-semibold">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="bg-white/20 border-white/30 text-white text-base placeholder:text-gray-300 focus:border-white/60 focus:ring-white/40"
      />
    </div>
  );
};

