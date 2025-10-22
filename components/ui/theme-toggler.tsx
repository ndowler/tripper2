"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { Switch } from "@/components/ui/switch";

export function ThemeMenuItems() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const icon = React.useMemo(() => {
    return isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />;
  }, [isDark]);

  return (
    <DropdownMenuItem onClick={(e) => e.preventDefault()}>
      <div className="flex items-center justify-between w-full">
        {icon}
        {isDark ? "Dark" : "Light"}
        <Switch
          checked={isDark}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          className="ml-2"
        />
      </div>
    </DropdownMenuItem>
  );
}

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="inline-flex items-center justify-center rounded-md border border-input bg-background p-2">
              <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipTrigger>
      <TooltipContent side="bottom">Theme</TooltipContent>
    </Tooltip>
  );
}
