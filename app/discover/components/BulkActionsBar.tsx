import { SuggestionCard } from "@/lib/types/suggestions";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BulkActionsBarProps {
  selectedIds: Set<string>;
  suggestions: SuggestionCard[];
  handleDeselectAll: () => void;
  handleSelectAll: () => void;
  handleSaveSelected: () => void;
}

export function BulkActionsBar({
  selectedIds,
  suggestions,
  handleDeselectAll,
  handleSelectAll,
  handleSaveSelected,
}: BulkActionsBarProps) {
  return (
    <div>
      {selectedIds.size > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-medium">{selectedIds.size} selected</span>
              <Button variant="ghost" size="sm" onClick={handleDeselectAll}>
                Deselect All
              </Button>
              {selectedIds.size < suggestions.length && (
                <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                  Select All
                </Button>
              )}
            </div>
            <Button onClick={handleSaveSelected}>
              Save {selectedIds.size} to Things to Do
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
