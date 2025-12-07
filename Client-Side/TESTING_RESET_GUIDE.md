# How to Reset Challenge Data for Testing

## Quick Reset Method

### Option 1: Browser Console (Recommended)
1. Open your browser's Developer Tools (F12)
2. Go to the **Console** tab
3. Run this command:
```javascript
localStorage.removeItem('challengesDetoxData');
location.reload();
```

This will:
- Clear all challenge data (points, badges, active challenges)
- Refresh the page
- Start with a clean slate (0 points, no badges, no challenges)

### Option 2: Application Storage
1. Open Developer Tools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage** in the left sidebar
4. Click on your app's domain
5. Find `challengesDetoxData` and delete it
6. Refresh the page

### Option 3: Clear All Storage
```javascript
localStorage.clear();
location.reload();
```
⚠️ **Warning**: This clears ALL localStorage data including user profile!

## Expected Result After Reset

### User Profile Should Show:
- **Points**: 0 Points
- **Current Challenges**: Empty state with message "No active challenges yet!"
- **Earned Badges**: Empty state with message "Complete challenges to earn unique badges!"

## Testing Workflow After Reset

### Step 1: Verify Clean State
✅ Profile shows 0 points  
✅ No badges displayed  
✅ No current challenges  

### Step 2: Join First Challenge
1. Navigate to **Challenges** section
2. Click on any challenge (e.g., "Drink 8 Glasses of Water")
3. Click **"Join Challenge"** button
4. Go back to **User Profile**
5. ✅ Should see challenge in "Current Challenges" (0/7 days, 0%)

### Step 3: Mark Progress
1. Go to challenge details
2. Click Day 1 to mark complete
3. Return to profile
4. ✅ Progress updates to 1/7 days, 14%

### Step 4: Complete Challenge
1. Mark all days complete (Days 1-7)
2. Return to profile
3. ✅ Challenge disappears from "Current Challenges"
4. ✅ Badge appears in "Earned Badges" (💧 Water Master)
5. ✅ Points increase to 50

### Step 5: Multiple Challenges
1. Join and complete 2 more challenges
2. Check profile
3. ✅ 3 badges displayed
4. ✅ Points = sum of all challenge points

## Troubleshooting

### Points Still Showing Wrong Value?
1. Check browser console for errors
2. Verify you cleared the correct localStorage key
3. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Clear browser cache if needed

### Changes Not Updating?
1. Wait 2-3 seconds (auto-update interval)
2. Check if JavaScript errors in console
3. Verify you're on the User Profile page
4. Try manual page refresh

## Development Reset Script

For quick testing during development, you can create a reset button:

```typescript
// Add to any component for testing
resetChallengeData() {
  localStorage.removeItem('challengesDetoxData');
  alert('Challenge data reset! Refreshing page...');
  location.reload();
}
```

```html
<!-- Add to template for testing -->
<button (click)="resetChallengeData()" class="reset-btn">
  🔄 Reset Challenge Data (Testing)
</button>
```

## Data Structure Reference

The `challengesDetoxData` localStorage key contains:
```json
{
  "challenges": [
    {
      "id": 1,
      "title": "Drink 8 Glasses of Water",
      "icon": "💧",
      "progress": [false, false, false, false, false, false, false],
      "pointsEarned": 0,
      "badgeEarned": false
    }
  ],
  "user": {
    "points": 0,
    "badges": [],
    "challengeBadges": []
  }
}
```

## Clean Testing Checklist

Before reporting issues:
- [ ] Cleared localStorage data
- [ ] Refreshed the page
- [ ] Verified starting state (0 points)
- [ ] Joined a challenge successfully
- [ ] Marked at least one day complete
- [ ] Checked for console errors
- [ ] Waited 2+ seconds for updates

## Quick Commands Summary

```javascript
// View current data
console.log(JSON.parse(localStorage.getItem('challengesDetoxData')));

// Reset data
localStorage.removeItem('challengesDetoxData');
location.reload();

// Check points specifically
const data = JSON.parse(localStorage.getItem('challengesDetoxData'));
console.log('Points:', data?.user?.points || 0);

// Check badges
console.log('Badges:', data?.user?.challengeBadges || []);
```

---

**After clearing localStorage, your profile should start fresh with 0 points!** 🎯
