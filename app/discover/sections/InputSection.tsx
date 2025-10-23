import { Sparkles } from "lucide-react";
import { VibesPreviewSection } from "./VibesPreviewSection";
import { getVibesSummary } from "@/lib/utils/vibes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StateInput } from "@/app/discover/components/StateInput";
import { DatesInput } from "@/app/discover/components/DatesInput";
import { BasicInput } from "@/components/basic/BasicInput";
import { UserVibes } from "@/lib/types/vibes";

interface InputSectionProps {
  destination: {
    city: string;
    state: string;
    country: string;
    startDate: string;
    endDate: string;
  };
  setDestination: React.Dispatch<
    React.SetStateAction<{
      city: string;
      state: string;
      country: string;
      startDate: string;
      endDate: string;
    }>
  >;
  hasVibes: boolean;
  userVibes: UserVibes | null;
  handleGenerate: () => void;
}

export function InputSection({
  destination,
  setDestination,
  hasVibes,
  userVibes,
  handleGenerate,
}: InputSectionProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <CardContent className="space-y-6">
          {/* Destination Inputs */}
          <BasicInput
            label="City"
            id="city"
            type="text"
            placeholder="Boston, Paris, Rome, Tokyo"
            value={destination.city}
            onChange={(value) =>
              setDestination({ ...destination, city: value })
            }
          />

          <StateInput
            setDestinationState={(state) =>
              setDestination({ ...destination, state })
            }
          />

          <BasicInput
            label="Country Code (optional)"
            id="country"
            type="text"
            placeholder="GB, FR, IT, JP, US"
            value={destination.country}
            onChange={(value) =>
              setDestination({
                ...destination,
                country: value,
              })
            }
          />

          <DatesInput
            destination={destination}
            setDestination={setDestination}
          />

          {/* Vibes Preview */}
          <VibesPreviewSection
            hasVibes={hasVibes}
            getVibesSummary={getVibesSummary}
            userVibes={userVibes}
          />

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!destination.city?.trim()}
            className="w-full"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Suggestions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
