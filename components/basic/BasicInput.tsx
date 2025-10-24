import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
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
    <Field>
      <FieldLabel htmlFor={id} className="block text-sm font-medium ml-2">
        {label}{" "}
        {inputProps.required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <FieldContent>
        <Input
          id={id}
          {...inputProps}
          onChange={(e) => onChange(e.target.value)}
        />
      </FieldContent>
    </Field>
  );
}
