import { BasicInput } from "@/components/basic/BasicInput";
import { Destination } from "@/lib/types";

interface DatesInputProps {
  destination: Destination;
  setDestination: React.Dispatch<React.SetStateAction<Destination>>;
}

export function DatesInput({ destination, setDestination }: DatesInputProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <BasicInput
        label="Start Date (optional)"
        id="startDate"
        type="date"
        value={destination.startDate}
        onChange={(value) =>
          setDestination({
            ...destination,
            startDate: value,
          })
        }
      />

      <BasicInput
        label="End Date (optional)"
        id="endDate"
        type="date"
        value={destination.endDate}
        onChange={(value) =>
          setDestination({
            ...destination,
            endDate: value,
          })
        }
      />
    </div>
  );
}
