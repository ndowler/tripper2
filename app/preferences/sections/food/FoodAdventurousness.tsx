"use client";
import { BasicSelect } from "@/app/preferences/components/BasicSelect";

const adventurousnessOptions = {
  1: "🍽️ Low – Prefer familiar foods",
  2: "🍲 Medium – Open to local specialties",
  3: "🌶️ High – Enjoy trying authentic cuisine",
  4: "🧪 Very High – Experimental dishes, please!",
};

interface FoodAdventurousnessProps {
  preferences: any;
  onChange: (value: string) => void;
}
export function FoodAdventurousness({
  preferences,
  onChange,
}: FoodAdventurousnessProps) {
  return (
    <BasicSelect
      label="Food Adventurousness"
      value={String(preferences.taste.food_adventurousness)}
      options={adventurousnessOptions}
      onChange={onChange}
    />
  );
}
