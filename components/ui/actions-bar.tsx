import Link from "next/link";
import { Compass, Download, MoreVertical, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle, ThemeMenuItems } from "@/components/ui/theme-toggler";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CustomTooltip } from "./custom-tooltip";

interface ActionsBarProps {
  discoverHref?: string;
  showDiscover?: boolean;
}

export function ActionsBar({
  discoverHref = "/discover",
  showDiscover = true,
}: ActionsBarProps) {
  return (
    <div className="flex items-center gap-2 flex-nowrap justify-center sm:w-auto overflow-x-auto">
      {/* Discover Button */}
      {showDiscover && (
        <CustomTooltip content="Discover More" side="bottom">
          <Link href={discoverHref}>
            <Button variant="outline" className="lg:px-3 flex-shrink-0">
              <Compass className="w-4 h-4 lg:mr-2" />
              <span className="hidden lg:inline whitespace-nowrap">
                Discover
              </span>
            </Button>
          </Link>
        </CustomTooltip>
      )}

      {/* Mobile Dropdown */}
      <CustomTooltip content="More actions" side="bottom">
        <div className="lg:hidden flex-shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export JSON
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <ThemeMenuItems />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CustomTooltip>

      {/* Desktop Actions */}
      <div className="hidden lg:flex gap-2">
        <Button variant="outline" size="icon" title="Export JSON">
          <Download className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" title="Share">
          <Share2 className="w-4 h-4" />
        </Button>
        <ModeToggle />
      </div>
    </div>
  );
}
