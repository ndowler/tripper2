# Phase 4.2 Testing Guide

## Quick Test Scenarios

### Scenario 1: Basic Discovery Flow
1. Navigate to http://localhost:3000/discover
2. Enter "Rome" in city field
3. Enter "Italy" in country field (optional)
4. Click "Generate 20 Suggestions"
5. **Expected:** Loading state with progress bar, then 20 suggestions displayed
6. **Verify:** Suggestions include diverse categories (food, culture, nature, etc.)

### Scenario 2: With User Vibes
1. Navigate to http://localhost:3000/vibes
2. Complete the vibes quiz (10 questions)
3. Navigate to http://localhost:3000/discover
4. Enter "Tokyo" and "Japan"
5. Click "Generate 20 Suggestions"
6. **Expected:** Suggestions tailored to your vibes (e.g., if Culture Crawl, more museums/temples)

### Scenario 3: Category Filtering
1. Complete Scenario 1
2. Click on different category chips (Food, Culture, Nature, etc.)
3. **Expected:** Grid filters to show only that category
4. **Verify:** Category count badges are correct

### Scenario 4: Multi-Select & Bulk Save
1. Complete Scenario 1
2. Deselect all cards (click "Deselect All")
3. Select 5 specific cards by clicking checkboxes
4. Click "Save 5 to Things to Do"
5. **Expected:** Toast confirmation, navigate to board
6. **Verify:** 5 cards appear in "Things to Do" column on board

### Scenario 5: Individual Card Save
1. Complete Scenario 1
2. Click on any suggestion card
3. Detail modal opens
4. Click "Save to Things to Do"
5. **Expected:** Toast confirmation, modal closes
6. Navigate to board
7. **Verify:** Card appears in "Things to Do"

### Scenario 6: Error Handling
1. Navigate to http://localhost:3000/discover
2. Leave city field empty
3. Click "Generate 20 Suggestions"
4. **Expected:** Error toast "Please enter a city name"

### Scenario 7: Navigation Integration
1. Navigate to http://localhost:3000/demo
2. Click "Discover" button in header toolbar
3. **Expected:** Navigate to discover page
4. Expand vibes card on board
5. Click "Discover" button in vibes card
6. **Expected:** Navigate to discover page

## API Testing

### Test OpenAI API Connection
1. Ensure `.env.local` has `OPENAI_API_KEY=your_key`
2. Open browser console (F12)
3. Complete Scenario 1
4. **Check Network Tab:** 
   - POST to `/api/vibe-suggestions`
   - Status: 200
   - Response has `suggestions` array with 10-20 items

### Test Error States
1. Temporarily remove/invalidate API key
2. Try generating suggestions
3. **Expected:** Error message "Invalid OpenAI API key"
4. Restore API key

## Visual Testing

### Desktop (1920x1080)
- [ ] Discover page layout looks good
- [ ] Suggestion grid shows 3 columns
- [ ] Category filters fit in one line
- [ ] Bulk actions bar is visible when cards selected
- [ ] Detail modal is centered and readable

### Tablet (768x1024)
- [ ] Suggestion grid shows 2 columns
- [ ] Input fields stack properly
- [ ] Navigation buttons are accessible
- [ ] Category filters wrap nicely

### Mobile (375x667)
- [ ] Suggestion grid shows 1 column
- [ ] Cards are full width
- [ ] Bulk actions bar is responsive
- [ ] Detail modal is readable
- [ ] Touch targets are large enough

## Accessibility Testing

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Space/Enter to toggle checkboxes
- [ ] Escape to close detail modal
- [ ] All buttons have visible focus states

### Screen Reader
- [ ] Card titles are announced
- [ ] Category filters are announced
- [ ] Checkbox states are announced
- [ ] Button purposes are clear

## Performance Testing

### API Performance
- [ ] First suggestion generation: < 10 seconds
- [ ] Subsequent generations: < 10 seconds
- [ ] No timeout errors

### Client Performance
- [ ] 20 cards render smoothly
- [ ] No layout shift during loading
- [ ] Smooth scrolling
- [ ] No janky animations

## Integration Testing

### With Existing Features
- [ ] Saved suggestions appear in "Things to Do"
- [ ] Drag & drop works with saved suggestions
- [ ] Undo/redo works with saved cards
- [ ] Command palette still works
- [ ] AI Day Planner still works

## Edge Cases

### Empty States
- [ ] No API key configured
- [ ] No vibes completed (shows CTA)
- [ ] No suggestions returned (error state)
- [ ] No cards selected (bulk action disabled)

### Invalid Inputs
- [ ] Empty city field (validation error)
- [ ] Special characters in city name
- [ ] Very long city name (> 100 chars)
- [ ] Invalid date range (end before start)

### Network Issues
- [ ] API timeout (> 30s)
- [ ] API rate limit (429 error)
- [ ] Network disconnected (offline)

## Regression Testing

Ensure existing features still work:
- [ ] Board loads correctly
- [ ] Cards can be created normally
- [ ] Drag & drop works
- [ ] Undo/redo works
- [ ] Command palette works
- [ ] AI Day Planner works
- [ ] Vibes quiz works
- [ ] Preferences page works

## Browser Compatibility

Test in multiple browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Success Criteria

✅ All test scenarios pass  
✅ No console errors  
✅ No linter errors  
✅ API responds correctly  
✅ UI is responsive  
✅ Accessibility is good  
✅ Performance is acceptable  

## Known Issues

Document any issues found during testing:
1. ...
2. ...
3. ...

## Next Steps After Testing

1. Fix any issues found
2. Update documentation
3. Update Memory Bank
4. Mark Phase 4.2 as complete
5. Plan Phase 4.3 (Visual Redesign)

