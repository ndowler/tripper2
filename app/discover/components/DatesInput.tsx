import { BasicInput } from "@/components/basic/BasicInput";

interface DatesInputProps {
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
