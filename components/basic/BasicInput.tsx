import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputHTMLAttributes } from "react";

interface BasicInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  id: string;
  onChange: (value: string) => void;
}

export function BasicInput({
  label,
  id,
  onChange,
  ...inputProps
}: BasicInputProps) {
  return (
    <div>
      <Label htmlFor={id} className="block text-sm font-medium mb-2 ml-2">
        {label}{" "}
        {inputProps.required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        id={id}
        {...inputProps}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
