import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { InputHTMLAttributes } from "react";

interface BasicTextareaProps
  extends Omit<InputHTMLAttributes<HTMLTextAreaElement>, "onChange"> {
  label: string;
  id: string;
  onChange: (value: string) => void;
  rows?: number;
}

export function BasicTextarea({
  label,
  id,
  onChange,
  ...textareaProps
}: BasicTextareaProps) {
  return (
    <div>
      <Label htmlFor={id} className="block text-sm font-medium mb-2 ml-2">
        {label}{" "}
        {textareaProps.required && <span className="text-destructive">*</span>}
      </Label>
      <Textarea
        id={id}
        {...textareaProps}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
