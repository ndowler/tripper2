'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plane, Calendar, Clock, DollarSign, Loader2 } from 'lucide-react'
import { useTripStore } from '@/lib/store/tripStore'
import { FlightDetails } from '@/lib/types'
import { toast } from 'sonner'
import { nanoid } from 'nanoid'
import { format } from 'date-fns'

interface FlightBookingModalProps {
  isOpen: boolean
  onClose: () => void
  tripId: string
  destination?: string
  startDate?: string
  endDate?: string
}

export function FlightBookingModal({ 
  isOpen, 
  onClose, 
  tripId,
  destination,
  startDate,
  endDate 
}: FlightBookingModalProps) {
  const userProfile = useTripStore(state => state.userProfile)
  const addCard = useTripStore(state => state.addCard)
  const getCurrentTrip = useTripStore(state => state.getCurrentTrip)
  const trip = getCurrentTrip()
  
  // Outbound flight
  const [outboundFrom, setOutboundFrom] = useState(userProfile?.homeAirport?.code || '')
  const [outboundTo, setOutboundTo] = useState('')
  const [outboundDate, setOutboundDate] = useState(startDate || '')
  const [outboundTime, setOutboundTime] = useState('08:00')
  const [outboundAirline, setOutboundAirline] = useState('')
  const [outboundFlightNumber, setOutboundFlightNumber] = useState('')
  const [outboundCost, setOutboundCost] = useState('')
  const [outboundDuration, setOutboundDuration] = useState('')
  const [outboundClass, setOutboundClass] = useState<'economy' | 'premium' | 'business' | 'first'>('economy')
  
  // Return flight
  const [returnFrom, setReturnFrom] = useState('')
  const [returnTo, setReturnTo] = useState(userProfile?.homeAirport?.code || '')
  const [returnDate, setReturnDate] = useState(endDate || '')
  const [returnTime, setReturnTime] = useState('15:00')
  const [returnAirline, setReturnAirline] = useState('')
  const [returnFlightNumber, setReturnFlightNumber] = useState('')
  const [returnCost, setReturnCost] = useState('')
  const [returnDuration, setReturnDuration] = useState('')
  const [returnClass, setReturnClass] = useState<'economy' | 'premium' | 'business' | 'first'>('economy')
  
  const [bookingRef, setBookingRef] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  // Pre-fill destination airport from trip destination
  useEffect(() => {
    if (destination && !outboundTo) {
      // Try to extract airport code from destination
      // This is basic - could be enhanced with airport lookup API
      setOutboundTo('')
      setReturnFrom('')
    }
  }, [destination])
  
  const handleAddFlights = () => {
    if (!outboundFrom || !outboundTo || !outboundDate) {
      toast.error('Please fill in outbound flight details')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Get first day or create one
      const firstDay = trip?.days[0]
      const lastDay = trip?.days[trip.days.length - 1]
      
      if (!firstDay) {
        toast.error('Trip must have at least one day')
        return
      }
      
      // Create outbound flight card
      const outboundCard = {
        id: nanoid(),
        type: 'flight' as const,
        title: `Flight to ${outboundTo}`,
        startTime: outboundTime,
        duration: outboundDuration ? parseInt(outboundDuration) : 480,
        location: {
          name: `${outboundFrom} → ${outboundTo}`,
        },
        notes: [
          outboundAirline && outboundFlightNumber ? `${outboundAirline} ${outboundFlightNumber}` : '',
          bookingRef ? `Booking: ${bookingRef}` : '',
          `Class: ${outboundClass.charAt(0).toUpperCase() + outboundClass.slice(1)}`,
        ].filter(Boolean).join('\n'),
        cost: outboundCost ? {
          amount: parseFloat(outboundCost),
          currency: 'USD',
        } : undefined,
        tags: ['flight', 'outbound', outboundClass],
        links: [],
        status: 'confirmed' as const,
      }
      
      addCard(tripId, firstDay.id, outboundCard)
      toast.success(`✈️ Added outbound flight`)
      
      // Create return flight card if provided
      if (returnFrom && returnTo && returnDate && lastDay) {
        const returnCard = {
          id: nanoid(),
          type: 'flight' as const,
          title: `Flight to ${returnTo}`,
          startTime: returnTime,
          duration: returnDuration ? parseInt(returnDuration) : 480,
          location: {
            name: `${returnFrom} → ${returnTo}`,
          },
          notes: [
            returnAirline && returnFlightNumber ? `${returnAirline} ${returnFlightNumber}` : '',
            bookingRef ? `Booking: ${bookingRef}` : '',
            `Class: ${returnClass.charAt(0).toUpperCase() + returnClass.slice(1)}`,
          ].filter(Boolean).join('\n'),
          cost: returnCost ? {
            amount: parseFloat(returnCost),
            currency: 'USD',
          } : undefined,
          tags: ['flight', 'return', returnClass],
          links: [],
          status: 'confirmed' as const,
        }
        
        addCard(tripId, lastDay.id, returnCard)
        toast.success(`✈️ Added return flight`)
      }
      
      onClose()
    } catch (error) {
      console.error('Error adding flights:', error)
      toast.error('Failed to add flights')
    } finally {
      setIsLoading(false)
    }
  }
  
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
              <div>
                <label className="text-sm font-medium mb-1 block">From (Airport Code)</label>
                <Input
                  placeholder="JFK"
                  value={outboundFrom}
                  onChange={(e) => setOutboundFrom(e.target.value.toUpperCase())}
                  maxLength={3}
                  className="uppercase"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">To (Airport Code)</label>
                <Input
                  placeholder="FCO"
                  value={outboundTo}
                  onChange={(e) => setOutboundTo(e.target.value.toUpperCase())}
                  maxLength={3}
                  className="uppercase"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Input
                  type="date"
                  value={outboundDate}
                  onChange={(e) => setOutboundDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Departure Time</label>
                <Input
                  type="time"
                  value={outboundTime}
                  onChange={(e) => setOutboundTime(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Airline (Optional)</label>
                <Input
                  placeholder="United Airlines"
                  value={outboundAirline}
                  onChange={(e) => setOutboundAirline(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Flight Number (Optional)</label>
                <Input
                  placeholder="UA123"
                  value={outboundFlightNumber}
                  onChange={(e) => setOutboundFlightNumber(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Cost (Optional)</label>
                <Input
                  type="number"
                  placeholder="650"
                  value={outboundCost}
                  onChange={(e) => setOutboundCost(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Duration (min)</label>
                <Input
                  type="number"
                  placeholder="480"
                  value={outboundDuration}
                  onChange={(e) => setOutboundDuration(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Class</label>
                <select
                  value={outboundClass}
                  onChange={(e) => setOutboundClass(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="economy">Economy</option>
                  <option value="premium">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Return Flight */}
          <div className="space-y-4 p-4 rounded-lg border bg-card">
            <h3 className="font-semibold flex items-center gap-2">
              🏠 Return Flight (Optional)
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">From (Airport Code)</label>
                <Input
                  placeholder={outboundTo || "FCO"}
                  value={returnFrom}
                  onChange={(e) => setReturnFrom(e.target.value.toUpperCase())}
                  maxLength={3}
                  className="uppercase"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">To (Airport Code)</label>
                <Input
                  placeholder={outboundFrom || "JFK"}
                  value={returnTo}
                  onChange={(e) => setReturnTo(e.target.value.toUpperCase())}
                  maxLength={3}
                  className="uppercase"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Date</label>
                <Input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Departure Time</label>
                <Input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Airline (Optional)</label>
                <Input
                  placeholder="United Airlines"
                  value={returnAirline}
                  onChange={(e) => setReturnAirline(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Flight Number (Optional)</label>
                <Input
                  placeholder="UA456"
                  value={returnFlightNumber}
                  onChange={(e) => setReturnFlightNumber(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Cost (Optional)</label>
                <Input
                  type="number"
                  placeholder="650"
                  value={returnCost}
                  onChange={(e) => setReturnCost(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Duration (min)</label>
                <Input
                  type="number"
                  placeholder="480"
                  value={returnDuration}
                  onChange={(e) => setReturnDuration(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Class</label>
                <select
                  value={returnClass}
                  onChange={(e) => setReturnClass(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="economy">Economy</option>
                  <option value="premium">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Booking Reference */}
          <div>
            <label className="text-sm font-medium mb-1 block">Booking Reference (Optional)</label>
            <Input
              placeholder="ABC123XYZ"
              value={bookingRef}
              onChange={(e) => setBookingRef(e.target.value)}
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
              disabled={isLoading || !outboundFrom || !outboundTo || !outboundDate}
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
  )
}

