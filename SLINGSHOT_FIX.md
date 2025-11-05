# Slingshot Fix - Database Schema Update Required

## Issue
Slingshot trips were being created but showing up blank because:
1. The database schema was missing columns for Slingshot metadata
2. Card creation errors were being logged but not thrown, causing silent failures
3. The trips service wasn't handling the new Slingshot fields

## Fixed Issues

### 1. Added Slingshot Fields to Database Schema
**File: `lib/supabase/add_slingshot_fields.sql`** (NEW)

Run this SQL in your Supabase SQL Editor to add the required columns:

```sql
ALTER TABLE public.trips 
ADD COLUMN IF NOT EXISTS is_slingshot_generated boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS slingshot_metadata jsonb;
```

### 2. Updated Trips Service to Handle Slingshot Fields
**File: `lib/services/trips-service.ts`**

- Added `is_slingshot_generated` and `slingshot_metadata` to trip INSERT
- Added `travelers` and `currency` fields (were missing)
- Updated `transformTripFromDb` to read these fields back
- **IMPORTANT**: Changed card creation errors from logging to throwing - prevents silent failures

### 3. Improved Card Data Formatting
**File: `lib/store/tripStore.ts`**

- Enhanced card creation in `generateSlingshotTrip` to ensure all fields are properly formatted
- Added explicit field initialization for all Card properties
- Ensures arrays are always arrays (not null/undefined)

## How to Fix Your Installation

### Step 1: Run the Database Migration
1. Open Supabase Dashboard → SQL Editor
2. Run the contents of `lib/supabase/add_slingshot_fields.sql`:
   ```sql
   ALTER TABLE public.trips 
   ADD COLUMN IF NOT EXISTS is_slingshot_generated boolean DEFAULT false,
   ADD COLUMN IF NOT EXISTS slingshot_metadata jsonb;
   ```
3. Click "Run" to execute

### Step 2: Test Slingshot Again
1. Navigate to `/trips`
2. Click "Create New Trip"
3. Select "Slingshot"
4. Fill in the questionnaire
5. Generate a trip
6. The trip should now have all days and cards populated

### Step 3: If You Still See Errors
Check the browser console for detailed error messages. The improved logging will now show:
- Exact Supabase error messages
- Sample card data being inserted
- Which day/card is failing

Common issues and solutions:
- **"Column does not exist"**: You need to run the database migration (Step 1)
- **"Invalid JSON"**: Check that location/cost objects are properly formatted
- **"Foreign key violation"**: Ensure trip and day IDs match

## What Was Changed

### Database Schema Changes
```sql
-- Added to trips table:
is_slingshot_generated boolean DEFAULT false
slingshot_metadata jsonb
```

### Code Changes
1. **lib/services/trips-service.ts**:
   - Line 119-120: Insert Slingshot fields
   - Line 196: Throw error instead of logging (prevents silent failures)
   - Line 387-388: Read Slingshot fields from database

2. **lib/store/tripStore.ts**:
   - Lines 165-185: Improved card formatting with explicit field initialization

3. **lib/supabase/add_slingshot_fields.sql** (NEW):
   - Migration script for database schema

## Verification Checklist

After applying the fix, verify:
- [ ] Database migration ran successfully
- [ ] No SQL errors in Supabase logs
- [ ] Slingshot questionnaire loads properly
- [ ] Loading overlay shows progress
- [ ] Trip generates without errors
- [ ] All days appear in the trip
- [ ] All cards appear in each day
- [ ] Vibe explanation overlay appears
- [ ] Trip can be edited normally
- [ ] Cards can be moved/edited/deleted

## Previous Errors Fixed

### Before
```
Error creating cards: Object
Failed to load resource: 400
```
Silent failures - trips created with no cards.

### After
```
Failed to create cards for day XYZ: [Detailed error message]
```
Explicit errors with details for debugging.

## Technical Notes

### Why This Happened
The Slingshot feature added new optional fields to the Trip type:
- `isSlingshotGenerated?: boolean`
- `slingshotMetadata?: object`

These fields need corresponding database columns. Without them, the ORM tries to insert data into non-existent columns, causing a 400 error.

The original service code was also logging card errors instead of throwing them, which meant trips would be created successfully but with zero cards - appearing "blank" in the UI.

### Card Creation Flow
1. `generateSlingshotTrip` (store) → Calls API
2. API returns day/card data
3. Store transforms to Trip structure
4. Store calls `addTrip` with full trip structure
5. `addTrip` calls `createTrip` service
6. Service inserts trip, then days, then cards
7. If any card insert fails → now throws error (previously logged)

### Slingshot Metadata Structure
```typescript
{
  questionnaire: {
    destination: string
    startDate: string
    endDate: string
    duration: number
    budget: 'budget' | 'moderate' | 'comfortable' | 'luxury'
    travelers: number
    tripPurpose: string
    mustDos?: string
    existingPlans?: string
  },
  generatedAt: string // ISO timestamp
  explanation: string // Vibe explanation paragraph
}
```

## Support

If you continue to experience issues:
1. Check browser console for errors
2. Check Supabase logs for database errors
3. Verify the migration ran successfully:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'trips' 
   AND column_name IN ('is_slingshot_generated', 'slingshot_metadata');
   ```
4. Should return 2 rows showing these columns exist

