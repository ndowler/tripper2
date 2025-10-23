import { Button } from "./button";
import { ButtonGroup } from "./button-group";
import { CustomTooltip } from "./custom-tooltip";
import { Redo2, Undo2 } from "lucide-react";
import { Separator } from "./separator";
import { toast } from "sonner";
import { useUndoRedo } from "@/lib/hooks/useUndoRedo";

export function UndoRedoGroup() {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  return (
    <div id="undo-redo" className="flex gap-1">
      <ButtonGroup className="border rounded-lg">
        <CustomTooltip content="Undo (Cmd+Z)" side="bottom">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              undo();
              toast.success("Undone");
            }}
            disabled={!canUndo}
          >
            <Undo2 className="w-4 h-4" />
          </Button>
        </CustomTooltip>
        <Separator orientation="vertical" />
        <CustomTooltip content="Redo (Cmd+Shift+Z)" side="bottom">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              redo();
              toast.success("Redone");
            }}
            disabled={!canRedo}
          >
            <Redo2 className="w-4 h-4" />
          </Button>
        </CustomTooltip>
      </ButtonGroup>
    </div>
  );
}
