"use client";

import { UserVibes } from "@/lib/types/vibes";
import { BasicSelect } from "@/app/preferences/components/BasicSelect";

const budgetOptions = {
  40: "💸 €30-50 - Budget-conscious",
  75: "💳 €50-100 - Moderate spending",
  150: "💼 €100-200 - Comfortable budget",
  250: "👑 €200+ - Luxury experience",
};

interface DailyBudgetProps {
  preferences: UserVibes;
  onChange: (value: string) => void;
}

export function DailyBudget({ preferences, onChange }: DailyBudgetProps) {
  return (
    <BasicSelect
      label="Daily Budget (per person, excluding hotel)"
      value={String(preferences.logistics.budget_ppd)}
      options={budgetOptions}
      onChange={onChange}
    />
  );
}
