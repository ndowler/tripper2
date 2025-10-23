"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Plane, Loader2 } from "lucide-react";
import { useTripStore } from "@/lib/store/tripStore";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { FlightClass } from "@/lib/types";
import { BasicInput } from "../basic/BasicInput";
import { BasicSelect } from "../basic/BasicSelect";

interface FlightBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tripId: string;
  destination?: string;
  startDate?: string;
  endDate?: string;
}

export function FlightBookingModal({
  isOpen,
  onClose,
  tripId,
  destination,
  startDate,
  endDate,
}: FlightBookingModalProps) {
  const userProfile = useTripStore((state) => state.userProfile);
  const addCard = useTripStore((state) => state.addCard);
  const getCurrentTrip = useTripStore((state) => state.getCurrentTrip);
  const trip = getCurrentTrip();

  // Outbound flight
  const [outboundFrom, setOutboundFrom] = useState(
    userProfile?.homeAirport?.code || ""
  );
  const [outboundTo, setOutboundTo] = useState("");
  const [outboundDate, setOutboundDate] = useState(startDate || "");
  const [outboundTime, setOutboundTime] = useState("08:00");
  const [outboundAirline, setOutboundAirline] = useState("");
  const [outboundFlightNumber, setOutboundFlightNumber] = useState("");
  const [outboundCost, setOutboundCost] = useState("");
  const [outboundDuration, setOutboundDuration] = useState("");
  const [outboundClass, setOutboundClass] = useState<FlightClass>("economy");

  // Return flight
  const [returnFrom, setReturnFrom] = useState("");
  const [returnTo, setReturnTo] = useState(
    userProfile?.homeAirport?.code || ""
  );
  const [returnDate, setReturnDate] = useState(endDate || "");
  const [returnTime, setReturnTime] = useState("15:00");
  const [returnAirline, setReturnAirline] = useState("");
  const [returnFlightNumber, setReturnFlightNumber] = useState("");
  const [returnCost, setReturnCost] = useState("");
  const [returnDuration, setReturnDuration] = useState("");
  const [returnClass, setReturnClass] = useState<FlightClass>("economy");

  const [bookingRef, setBookingRef] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill destination airport from trip destination
  useEffect(() => {
    if (destination && !outboundTo) {
      // Try to extract airport code from destination
      // This is basic - could be enhanced with airport lookup API
      setOutboundTo("");
      setReturnFrom("");
    }
  }, [destination, outboundTo, returnFrom]);

  const handleAddFlights = () => {
    if (!outboundFrom || !outboundTo || !outboundDate) {
      toast.error("Please fill in outbound flight details");
      return;
    }

    setIsLoading(true);

    try {
      // Get first day or create one
      const firstDay = trip?.days[0];
      const lastDay = trip?.days[trip.days.length - 1];

      if (!firstDay) {
        toast.error("Trip must have at least one day");
        return;
      }

      // Create outbound flight card
      const outboundCard = {
        id: nanoid(),
        type: "flight" as const,
        title: `Flight to ${outboundTo}`,
        startTime: outboundTime,
        duration: outboundDuration ? parseInt(outboundDuration) : 480,
        location: {
          name: `${outboundFrom} → ${outboundTo}`,
        },
        notes: [
          outboundAirline && outboundFlightNumber
            ? `${outboundAirline} ${outboundFlightNumber}`
            : "",
          bookingRef ? `Booking: ${bookingRef}` : "",
          `Class: ${
            outboundClass.charAt(0).toUpperCase() + outboundClass.slice(1)
          }`,
        ]
          .filter(Boolean)
          .join("\n"),
        cost: outboundCost
          ? {
              amount: parseFloat(outboundCost),
              currency: "USD",
            }
          : undefined,
        tags: ["flight", "outbound", outboundClass],
        links: [],
        status: "confirmed" as const,
      };

      addCard(tripId, firstDay.id, outboundCard);
      toast.success(`✈️ Added outbound flight`);

      // Create return flight card if provided
      if (returnFrom && returnTo && returnDate && lastDay) {
        const returnCard = {
          id: nanoid(),
          type: "flight" as const,
          title: `Flight to ${returnTo}`,
          startTime: returnTime,
          duration: returnDuration ? parseInt(returnDuration) : 480,
          location: {
            name: `${returnFrom} → ${returnTo}`,
          },
          notes: [
            returnAirline && returnFlightNumber
              ? `${returnAirline} ${returnFlightNumber}`
              : "",
            bookingRef ? `Booking: ${bookingRef}` : "",
            `Class: ${
              returnClass.charAt(0).toUpperCase() + returnClass.slice(1)
            }`,
          ]
            .filter(Boolean)
            .join("\n"),
          cost: returnCost
            ? {
                amount: parseFloat(returnCost),
                currency: "USD",
              }
            : undefined,
          tags: ["flight", "return", returnClass],
          links: [],
          status: "confirmed" as const,
        };

        addCard(tripId, lastDay.id, returnCard);
        toast.success(`✈️ Added return flight`);
      }

      onClose();
    } catch (error) {
      console.error("Error adding flights:", error);
      toast.error("Failed to add flights");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plane className="w-5 h-5" />
            Add Flights to Trip
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Outbound Flight */}
          <div className="space-y-4 p-4 rounded-lg border bg-card">
            <h3 className="font-semibold flex items-center gap-2">
              ✈️ Outbound Flight
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <BasicInput
                id="outboundFrom"
                label="From (Airport Code)"
                value={outboundFrom}
                onChange={(value) => setOutboundFrom(value.toUpperCase())}
                maxLength={3}
                className="uppercase"
              />
              <BasicInput
                id="outboundTo"
                label="To (Airport Code)"
                value={outboundTo}
                onChange={(value) => setOutboundTo(value.toUpperCase())}
                maxLength={3}
                className="uppercase"
              />

              <BasicInput
                id="outboundTime"
                label="Departure Time"
                type="time"
                value={outboundTime}
                onChange={(value) => setOutboundTime(value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <BasicInput
                id="outboundDate"
                label="Date"
                type="date"
                value={outboundDate}
                onChange={(value) => setOutboundDate(value)}
              />
              <BasicInput
                id="outboundTime"
                label="Departure Time"
                type="time"
                value={outboundTime}
                onChange={(value) => setOutboundTime(value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <BasicInput
                id="outboundAirline"
                label="Airline (Optional)"
                value={outboundAirline}
                onChange={(value) => setOutboundAirline(value)}
              />
              <BasicInput
                id="outboundFlightNumber"
                label="Flight Number (Optional)"
                value={outboundFlightNumber}
                onChange={(value) => setOutboundFlightNumber(value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <BasicInput
                id="outboundCost"
                label="Cost (Optional)"
                type="number"
                placeholder="650"
                value={outboundCost}
                onChange={(value) => setOutboundCost(value)}
              />

              <BasicInput
                id="outboundDuration"
                label="Duration (min)"
                type="number"
                placeholder="480"
                value={outboundDuration}
                onChange={(value) => setOutboundDuration(value)}
              />
              <BasicSelect
                id="outboundClass"
                label="Class"
                value={outboundClass}
                onChange={(value) => setOutboundClass(value as FlightClass)}
                options={{
                  economy: "Economy",
                  premium: "Premium Economy",
                  business: "Business",
                  first: "First Class",
                }}
              />
            </div>
          </div>

          {/* Return Flight */}
          <div className="space-y-4 p-4 rounded-lg border bg-card">
            <h3 className="font-semibold flex items-center gap-2">
              🏠 Return Flight (Optional)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <BasicInput
                id="returnFrom"
                label="From (Airport Code)"
                value={returnFrom}
                onChange={(value) => setReturnFrom(value.toUpperCase())}
              />
              <BasicInput
                id="returnTo"
                label="To (Airport Code)"
                value={returnTo}
                onChange={(value) => setReturnTo(value.toUpperCase())}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <BasicInput
                id="returnDate"
                label="Date"
                value={returnDate}
                onChange={(value) => setReturnDate(value)}
              />
              <BasicInput
                id="returnTime"
                label="Departure Time"
                value={returnTime}
                onChange={(value) => setReturnTime(value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <BasicInput
                id="returnAirline"
                label="Airline (Optional)"
                value={returnAirline}
                onChange={(value) => setReturnAirline(value)}
              />
              <BasicInput
                id="returnFlightNumber"
                label="Flight Number (Optional)"
                value={returnFlightNumber}
                onChange={(value) => setReturnFlightNumber(value)}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <BasicInput
                id="returnCost"
                label="Cost (Optional)"
                type="number"
                placeholder="650"
                value={returnCost}
                onChange={(value) => setReturnCost(value)}
              />
              <BasicInput
                id="returnDuration"
                label="Duration (min)"
                value={returnDuration}
                onChange={(value) => setReturnDuration(value)}
                className="max-w-xs"
              />
              <BasicSelect
                label="Class"
                value={returnClass}
                onChange={(value) => setReturnClass(value as FlightClass)}
                options={{
                  economy: "Economy",
                  premium: "Premium Economy",
                  business: "Business",
                  first: "First Class",
                }}
              />
            </div>

            {/* Booking Reference */}
            <BasicInput
              id="bookingRef"
              label="Booking Reference (Optional)"
              value={bookingRef}
              onChange={(value) => setBookingRef(value)}
              className="max-w-xs"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Confirmation code for both flights
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleAddFlights}
              disabled={
                isLoading || !outboundFrom || !outboundTo || !outboundDate
              }
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding Flights...
                </>
              ) : (
                <>
                  <Plane className="w-4 h-4 mr-2" />
                  Add Flights to Trip
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
