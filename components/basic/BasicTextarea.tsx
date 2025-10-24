"use client";
import { Textarea } from "../ui/textarea";
import { InputHTMLAttributes } from "react";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

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
    <Field>
      <FieldLabel htmlFor={id} className="block text-sm font-medium mb-2 ml-2">
        {label}{" "}
        {textareaProps.required && <span className="text-destructive">*</span>}
      </FieldLabel>
      <FieldContent>
        <Textarea
          id={id}
          {...textareaProps}
          onChange={(e) => onChange(e.target.value)}
        />
      </FieldContent>
    </Field>
  );
}
