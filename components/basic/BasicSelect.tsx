"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

interface BasicSelect {
  id?: string;
  label: string;
  value: string;
  options: Record<string, string>;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function BasicSelect({
  id,
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
}: BasicSelect) {
  return (
    <Field className="w-full">
      <FieldLabel htmlFor={id} className="text-sm font-medium mb-2 block">
        {label}
      </FieldLabel>
      <FieldContent>
        <Select value={value} onValueChange={onChange} aria-label={label}>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(options).map(([optValue, label]) => (
                <SelectItem key={optValue} value={optValue}>
                  {label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FieldContent>
    </Field>
  );
}
