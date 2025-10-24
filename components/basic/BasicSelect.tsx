"use client";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    <div className="w-full px-3 py-2 border border-input bg-background rounded-md">
      <Label className="text-sm font-medium mb-2 block">
        {label}
      </Label>
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
    </div>
  );
}
