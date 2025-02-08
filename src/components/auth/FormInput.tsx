
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
      <Label htmlFor={id} className="text-white text-xl font-bold">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="bg-white/5 border-white/40 text-white text-lg placeholder:text-white/70 focus:border-white focus:ring-white/60"
      />
    </div>
  );
};

