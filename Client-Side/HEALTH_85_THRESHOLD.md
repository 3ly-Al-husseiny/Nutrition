# Health Issue Detection - 85% Threshold Update

## ✅ Updated Detection Logic

The health issue detection now uses a **85% threshold** - any metric below 85% is flagged as a health concern!

## 🎯 New Detection Rules

### Threshold Definitions

```typescript
const HEALTH_THRESHOLD = 85; // Anything below 85% is a concern

Severity Levels:
- Health Score < 60%  → 🔴 HIGH severity
- Health Score 60-84% → 🟠 MEDIUM severity  
- Health Score ≥ 85%  → ✅ GOOD (no issue)
```

## 📊 Physical Health Metrics

### 1. Eye Strain
**Calculation:** `Health = 100 - Eye Strain Progress`

| Eye Strain Progress | Health Score | Issue Displayed | Severity |
|---------------------|--------------|----------------|----------|
| 0-15% | 85-100% | (none) | ✅ Good |
| 16-40% | 60-84% | "Moderate Eye Strain" | 🟠 Medium |
| 41-100% | 0-59% | "High Eye Strain" | 🔴 High |

**Example:**
- Eye strain progress = 20% → Health = 80% → 🟠 "Moderate Eye Strain"
- Eye strain progress = 50% → Health = 50% → 🔴 "High Eye Strain"

### 2. Back Posture
**Calculation:** `Health = 100 - Back Discomfort Progress`

| Back Discomfort Progress | Health Score | Issue Displayed | Severity |
|--------------------------|--------------|----------------|----------|
| 0-15% | 85-100% | (none) | ✅ Good |
| 16-40% | 60-84% | "Back Discomfort" | 🟠 Medium |
| 41-100% | 0-59% | "Poor Back Posture" | 🔴 High |

**Example:**
- Back discomfort = 18% → Health = 82% → 🟠 "Back Discomfort"
- Back discomfort = 60% → Health = 40% → 🔴 "Poor Back Posture"

### 3. Neck Tension
**Calculation:** `Health = 100 - Neck Tension Progress`

| Neck Tension Progress | Health Score | Issue Displayed | Severity |
|-----------------------|--------------|----------------|----------|
| 0-15% | 85-100% | (none) | ✅ Good |
| 16-40% | 60-84% | "Neck Discomfort" | 🟠 Medium |
| 41-100% | 0-59% | "High Neck Tension" | 🔴 High |

**Example:**
- Neck tension = 25% → Health = 75% → 🟠 "Neck Discomfort"
- Neck tension = 70% → Health = 30% → 🔴 "High Neck Tension"

### 4. Energy Levels
**Calculation:** `Health = Energy Progress` (higher is better)

| Energy Progress | Health Score | Issue Displayed | Severity |
|-----------------|--------------|----------------|----------|
| 85-100% | 85-100% | (none) | ✅ Good |
| 60-84% | 60-84% | "Reduced Activity" | 🟠 Medium |
| 0-59% | 0-59% | "Low Energy Levels" | 🔴 High |

**Example:**
- Energy = 70% → 🟠 "Reduced Activity"
- Energy = 40% → 🔴 "Low Energy Levels"

## 🧠 Mental Health Metrics

### Individual Sections

Each mental health section (Stress, Anxiety, Depression, Sleep, Social, Focus) is evaluated:

| Section Score | Issue Displayed | Severity |
|---------------|----------------|----------|
| 85-100% | (none) | ✅ Good |
| 60-84% | "[Section] Needs Attention" | 🟠 Medium |
| 0-59% | "[Section] Issues" | 🔴 High |

**Examples:**
- Stress score = 72% → 🟠 "Stress Needs Attention"
- Anxiety score = 45% → 🔴 "Anxiety Issues"
- Sleep score = 88% → ✅ No issue

### Overall Mental Health

If no specific section issues found:

| Overall Score | Issue Displayed | Severity |
|---------------|----------------|----------|
| 85-100% | (none) | ✅ Good |
| 60-84% | "Mental Health Below Optimal" | 🟠 Medium |
| 0-59% | "Mental Health Needs Attention" | 🔴 High |

## 🧪 Testing Scenarios

### Scenario 1: Borderline Healthy (84%)

**Physical Check:**
- Eye strain progress: 16%
- Back discomfort: 16%
- Neck tension: 16%
- Energy: 84%

**Result:**
```
Health Issues:
👁️ Moderate Eye Strain [physical] 🟠
🧍 Back Discomfort [physical] 🟠
💆 Neck Discomfort [physical] 🟠
⚡ Reduced Activity [physical] 🟠
```

### Scenario 2: Just Healthy (85%)

**Physical Check:**
- Eye strain progress: 15%
- Back discomfort: 15%
- Neck tension: 15%
- Energy: 85%

**Result:**
```
✅ No health concerns detected!
```

### Scenario 3: Multiple Severe Issues

**Physical Check:**
- Eye strain: 70% → Health: 30% 🔴
- Back discomfort: 80% → Health: 20% 🔴
- Energy: 25% 🔴

**Mental Check:**
- Stress: 45% 🔴
- Anxiety: 50% 🔴

**Result:**
```
Health Issues:
👁️ High Eye Strain [physical] 🔴
🧍 Poor Back Posture [physical] 🔴
⚡ Low Energy Levels [physical] 🔴
🧠 Stress Issues [mental] 🔴
🧠 Anxiety Issues [mental]🔴
```

### Scenario 4: Mixed Severity

**Metrics:**
- Eye strain: 25% → Health: 75% 🟠
- Back: 50% → Health: 50% 🔴
- Mental overall: 70% 🟠

**Result:**
```
Health Issues:
👁️ Moderate Eye Strain [physical] 🟠
🧍 Poor Back Posture [physical] 🔴
🧠 Mental Health Below Optimal [mental] 🟠
```

## 📈 Sensitivity Comparison

### Old Thresholds vs New (85%)

| Metric | Old "Issue" Threshold | New "Issue" Threshold | Change |
|--------|----------------------|----------------------|---------|
| Eye Strain | > 40% progress | > 15% progress | ⬆️ More sensitive |
| Back Posture | > 40% discomfort | > 15% discomfort | ⬆️ More sensitive |
| Neck Tension | > 40% tension | > 15% tension | ⬆️ More sensitive |
| Energy | < 40% | < 85% | ⬆️ Much more sensitive |
| Mental Sections | < 80% | < 85% | ⬆️ More sensitive |
| Mental Overall | < 80% | < 85% | ⬆️ More sensitive |

**Impact:** The system is now **significantly more sensitive** and will detect issues earlier!

## 💡 Why 85%?

The 85% threshold represents:
- **Early Detection**: Catches problems before they become severe
- **Preventive Care**: Allows intervention at mild discomfort stage
- **Health Optimization**: Encourages maintaining high wellness standards
- **Medical Standard**: Aligns with many health assessment standards

## 🎯 Practical Examples

### Example 1: Office Worker

**After 3-Min Check:**
- Sitting time: 6 hours
- Eye strain: Moderate → 35% progress → Health: 65%
- Back: Slight discomfort → 20% → Health: 80%

**Issues Shown:**
```
👁️ Moderate Eye Strain [physical] 🟠
🧍 Back Discomfort [physical] 🟠
```

**Action**: Take breaks, adjust posture

### Example 2: Active But Stressed

**Physical:** All metrics good (> 85%)
**Mental:**
- Stress: 75% 🟠
- Sleep: 70% 🟠
- Other sections: > 85%

**Issues Shown:**
```
🧠 Stress Needs Attention [mental] 🟠
🧠 Sleep Needs Attention [mental] 🟠
```

**Action**: Stress management, sleep hygiene

### Example 3: Optimal Health

**All Metrics:**
- Eye strain: < 10%
- Back: < 5%
- Neck: < 5%
- Energy: 90%
- All mental: > 90%

**Issues Shown:**
```
✅ No health concerns detected!
Complete Physical and Mental examinations to track your health
```

## 🔧 Customization

The threshold is defined as a constant and can be easily adjusted:

```typescript
const HEALTH_THRESHOLD = 85; // Anything below 85% is a concern

// To make more strict:
const HEALTH_THRESHOLD = 90; // More issues flagged

// To make less strict:
const HEALTH_THRESHOLD = 75; // Fewer issues flagged
```

## 📊 Expected Behavior

With the 85% threshold:
- **More issues will be detected** (more sensitive)
- **Earlier intervention** opportunities
- **Better preventive care**
- Users motivated to maintain **high health scores**

## ✅ Summary

The new 85% threshold means:
- ✅ Any physical metric with > 15% severity → Issue flagged
- ✅ Any energy level < 85% → Issue flagged
- ✅ Any mental section < 85% → Issue flagged
- ✅ Overall mental health < 85% → Issue flagged
- ✅ Severity determined by how far below 85% (or 60% for high)

**Result: More comprehensive and sensitive health monitoring!** 🏥
