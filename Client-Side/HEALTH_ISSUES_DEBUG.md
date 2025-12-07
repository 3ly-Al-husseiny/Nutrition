# Health Issues Diagnostic Guide

## 🐛 Debugging "Wrong Issue Displayed" Problem

If you're seeing "Low Energy" but the actual issue is in "Lower Back and Shoulder", follow these steps:

### 1. Check Browser Console

Open DevTools (F12) and look for logs starting with:
- 🔍 Physical Insights
- 🧍 Back Posture - Progress
- 💆 Neck Tension - Progress
- ⚡ Energy - Progress

### 2. Check localStorage Data

Run this in browser console:
```javascript
// Check examination records
const records = JSON.parse(localStorage.getItem('examination_records') || '[]');
console.log('📋 Examination Records:', records);

// Check most recent 3
console.log('Last 3 records:', records.slice(0, 3));

// Check specifically for back and neck data
records.slice(0, 7).forEach((r, i) => {
  console.log(`Record ${i}:`, {
    type: r.type,
    timestamp: r.timestamp,
    lowerBackComfort: r.data.lowerBackComfort,
   lowerBackDiscomfort: r.data.lowerBackDiscomfort,
    upperBackDiscomfort: r.data.upperBackDiscomfort,
    neckComfort: r.data.neckComfort,
    neckDiscomfort: r.data.neckDiscomfort,
    energyLevel: r.data.energyLevel
  });
});
```

### 3. Expected Values

#### For Lower Back Issue:
```javascript
// 3-min check: lowerBackComfort (1-5, lower is worse)
lowerBackComfort: 1 or 2  // Should show as issue

// 6-min check: lowerBackDiscomfort (1-5, higher is worse)
lowerBackDiscomfort: 4 or 5  // Should show as issue

// 9-min check: lowerBackDiscomfort (1-5, higher is worse)
lowerBackDiscomfort: 4 or 5  // Should show as issue
```

#### For Shoulder/Neck Issue:
```javascript
// 3-min check: neckComfort (1-5, lower is worse)
neckComfort: 1 or 2  // Should show as issue

// 6-min/9-min: neckDiscomfort (1-5, higher is worse)
neckDiscomfort: 4 or 5  // Should show as issue
```

### 4. Calculate What Health Score Should Be

```javascript
// Run this after checking records above
const ExaminationService = new (function() {
  this.getRecords = () => JSON.parse(localStorage.getItem('examination_records') || '[]');
  
  this.analyzeBackHealth = () => {
    const last7 = this.getRecords().slice(0, 7);
    const backValues = [];
    
    last7.forEach(r => {
      if (r.type === '3min' && r.data.lowerBackComfort !== null) {
        backValues.push(6 - r.data.lowerBackComfort); // Invert
      } else if (r.type === '6min' && r.data.lowerBackDiscomfort !== null) {
        backValues.push(r.data.lowerBackDiscomfort);
      } else if (r.type === '9min' && r.data.lowerBackDiscomfort !== null) {
        const avg = (r.data.upperBackDiscomfort + r.data.lowerBackDiscomfort) / 2;
        backValues.push(avg);
      }
    });
    
    const backAvg = backValues.length > 0 
      ? backValues.reduce((a,b) => a+b, 0) / backValues.length 
      : 0;
    const backProgress = Math.min((backAvg / 5) * 100, 100);
    const backHealth = 100 - backProgress;
    
    console.log('📊 Back Analysis:', {
      values: backValues,
      average: backAvg,
      progress: backProgress,
      health: backHealth,
      shouldShowIssue: backHealth < 85
    });
    
    return { backAvg, backProgress, backHealth };
  };
})();

ExaminationService.analyzeBackHealth();
```

### 5. Common Problems

#### Problem 1: No Recent Examination
**Symptom:** All metrics show 0 or defaults  
**Solution:** Complete a new 3-min, 6-min, or 9-min check

#### Problem 2: Wrong Examination Type
**Symptom:** Back data not being read  
**Cause:** Using 3-min check but expecting 6-min/9-min format  
**Solution:** Check which examination type you completed

#### Problem 3: Inverted Scale Confusion
**3-min checks use "comfort" (1-5, higher is better)**
- 5 = Very comfortable → Good
- 1 = Very uncomfortable → Bad

**6-min/9-min checks use "discomfort" (1-5, higher is worse)**
- 5 = Very high discomfort → Bad
- 1 = No discomfort → Good

#### Problem 4: Energy Always Low
**Symptom:** Energy shows as issue even when it shouldn't  
**Cause:** Energy default might be 0  
**Check:**
```javascript
const records = JSON.parse(localStorage.getItem('examination_records') || '[]');
const energyValues = records.slice(0, 7)
  .filter(r => r.data.energyLevel !== null)
  .map(r => r.data.energyLevel);
console.log('Energy values:', energyValues);
const avgEnergy = energyValues.reduce((a,b) => a+b, 0) / energyValues.length;
console.log('Average energy:', avgEnergy, 'Progress:', (avgEnergy/10)*100);
```

### 6. Force Refresh

If data seems correct but UI doesn't update:
```javascript
// Clear component cache
location.reload();

// Or force re-render
window.dispatchEvent(new Event('storage'));
```

### 7. Manual Health Issue Check

Run this to see what SHOULD be displayed:
```javascript
function manualHealthCheck() {
  const data = JSON.parse(localStorage.getItem('examination_records') || '[]');
  const last7 = data.slice(0, 7);
  
  console.log('=== MANUAL HEALTH CHECK ===');
  console.log('Total records:', data.length);
  console.log('Analyzing last', last7.length, 'records');
  
  // Back
  const backs = last7.map(r => {
    if (r.type === '3min') return r.data.lowerBackComfort ? 6 - r.data.lowerBackComfort : null;
    if (r.type === '6min') return r.data.lowerBackDiscomfort;
    if (r.type === '9min') return (r.data.upperBackDiscomfort + r.data.lowerBackDiscomfort) / 2;
    return null;
  }).filter(v => v !== null);
  
  const backAvg = backs.length ? backs.reduce((a,b)=>a+b)/backs.length : 0;
  const backProg = (backAvg/5)*100;
  const backHealth = 100 - backProg;
  
  console.log('🧍 BACK:', {
    values: backs,
    avg: backAvg.toFixed(2),
    progress: backProg.toFixed(1) + '%',
   health: backHealth.toFixed(1) + '%',
    issue: backHealth < 85 ? (backHealth < 60 ? '🔴 Poor Back Posture' : '🟠 Back Discomfort') : '✅ Good'
  });
  
  // Neck
  const necks = last7.map(r => {
    if (r.type === '3min') return r.data.neckComfort ? 6 - r.data.neckComfort : null;
    return r.data.neckDiscomfort;
  }).filter(v => v !== null);
  
  const neckAvg = necks.length ? necks.reduce((a,b)=>a+b)/necks.length : 0;
  const neckProg = (neckAvg/5)*100;
  const neckHealth = 100 - neckProg;
  
  console.log('💆 NECK:', {
    values: necks,
    avg: neckAvg.toFixed(2),
    progress: neckProg.toFixed(1) + '%',
    health: neckHealth.toFixed(1) + '%',
    issue: neckHealth < 85 ? (neckHealth < 60 ? '🔴 High Neck Tension' : '🟠 Neck Discomfort') : '✅ Good'
  });
  
  // Energy
  const energies = last7.map(r => r.data.energyLevel).filter(v => v !== null && v !== undefined);
  const energyAvg = energies.length ? energies.reduce((a,b)=>a+b)/energies.length : 0;
  const energyProg = (energyAvg/10)*100;
  
  console.log('⚡ ENERGY:', {
    values: energies,
    avg: energyAvg.toFixed(2),
    progress: energyProg.toFixed(1) + '%',
    health: energyProg.toFixed(1) + '%',
    issue: energyProg < 85 ? (energyProg < 60 ? '🔴 Low Energy' : '🟠 Reduced Activity') : '✅ Good'
  });
}

manualHealthCheck();
```

### 8. What to Look For

After running the manual check, you should see something like:
```
🧍 BACK: { ... health: '45.0%', issue: '🔴 Poor Back Posture' }
💆 NECK: { ... health: '40.0%', issue: '🔴 High Neck Tension' }
⚡ ENERGY: { ... health: '90.0%', issue: '✅ Good' }
```

**If this shows the correct issues but the UI doesn't:** There's a component update problem  
**If this shows wrong issues:** There's a data reading problem  
**If this shows "Low Energy" as the only issue:** The back/neck data isn't being recorded properly

### 9. Solution Steps

1. **Run manual health check** (step 7)
2. **Compare** with what's shown in User Profile
3. **If mismatch:** Hard refresh (Ctrl+Shift+R)
4. **If still wrong:** Complete a new examination
5. ** Share console output** so I can help debug further

---

**Run the manual health check and share what it shows!** This will tell us exactly what's wrong. 🔍
