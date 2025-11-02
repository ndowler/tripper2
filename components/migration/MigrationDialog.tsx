'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { migrateLocalStorageToSupabase, clearLocalStorage } from '@/lib/utils/migration'
import { toast } from 'sonner'
import { Loader2, Upload, X } from 'lucide-react'

interface MigrationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  tripCount: number
  onComplete: () => void
}

export function MigrationDialog({ open, onOpenChange, userId, tripCount, onComplete }: MigrationDialogProps) {
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrationProgress, setMigrationProgress] = useState<string>('')

  const handleMigrate = async () => {
    setIsMigrating(true)
    setMigrationProgress('Starting migration...')

    try {
      const result = await migrateLocalStorageToSupabase(userId)

      if (result.success) {
        setMigrationProgress('Migration complete!')
        
        // Clear localStorage after successful migration
        clearLocalStorage()
        
        toast.success(
          `Successfully imported ${result.tripsCreated} ${result.tripsCreated === 1 ? 'trip' : 'trips'}, ` +
          `${result.daysCreated} ${result.daysCreated === 1 ? 'day' : 'days'}, and ` +
          `${result.cardsCreated} ${result.cardsCreated === 1 ? 'card' : 'cards'}!`
        )

        if (result.errors.length > 0) {
          console.warn('Migration errors:', result.errors)
          toast.warning(`Some items couldn't be imported: ${result.errors.length} errors`)
        }

        onComplete()
        onOpenChange(false)
      } else {
        throw new Error(result.errors.join(', '))
      }
    } catch (error: any) {
      console.error('Migration failed:', error)
      toast.error('Failed to import trips. Your local data is safe.')
      setMigrationProgress('')
    } finally {
      setIsMigrating(false)
    }
  }

  const handleSkip = () => {
    // Don't clear localStorage, user can migrate later
    onOpenChange(false)
    onComplete()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import Your Local Trips?
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <p>
              We found <strong>{tripCount}</strong> {tripCount === 1 ? 'trip' : 'trips'} saved locally on this device.
            </p>
            <p>
              Would you like to import them to your account? They'll be synced across all your devices.
            </p>
          </DialogDescription>
        </DialogHeader>

        {migrationProgress && (
          <div className="py-4 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p className="text-sm text-muted-foreground">{migrationProgress}</p>
          </div>
        )}

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={isMigrating}
            className="sm:w-auto w-full"
          >
            <X className="w-4 h-4 mr-2" />
            Skip for Now
          </Button>
          <Button
            onClick={handleMigrate}
            disabled={isMigrating}
            className="sm:w-auto w-full"
          >
            {isMigrating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Import Trips
              </>
            )}
          </Button>
        </DialogFooter>

        <p className="text-xs text-muted-foreground text-center">
          Your local data will remain safe if you skip. You can import later from your profile settings.
        </p>
      </DialogContent>
    </Dialog>
  )
}

