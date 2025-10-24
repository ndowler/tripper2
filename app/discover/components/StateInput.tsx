"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { US_STATE_CODES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StateInputProps {
  setDestinationState: (state: string) => void;
}

export function StateInput({ setDestinationState }: StateInputProps) {
  const [selectState, setSelectState] = useState(false);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 ml-2">
        <Label htmlFor="state">State (optional)</Label>
        <Checkbox
          id="state"
          onCheckedChange={(checked) => setSelectState(checked === true)}
        />
      </div>
      <div className={selectState ? "" : "hidden"}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="state"
              variant="outline"
              className="w-full justify-start"
            >
              {value || "Select a state..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Search states..." />
              <CommandList>
                <CommandEmpty>No states found.</CommandEmpty>
                <CommandGroup>
                  {US_STATE_CODES.map((state) => (
                    <CommandItem
                      key={state}
                      value={state}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                        setDestinationState(currentValue);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === state ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {state}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
