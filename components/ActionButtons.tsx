import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export function SaveButton({ handleSave }: { handleSave: () => void }) {
  return (
    <Button onClick={handleSave} className="gap-2">
      <Save className="w-4 h-4" />
      Save
    </Button>
  );
}

export function CancelButton() {
  return (
    <Link href="/demo">
      <Button variant="outline">Cancel</Button>
    </Link>
  );
}
