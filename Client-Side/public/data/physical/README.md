# Physical Module Data Structure

**Structure**:
```json
[
  {
    "id": "string",              // Unique identifier
    "name": "string",            // Section name (same as id)
    "displayName": "string",     // Human-readable name
    "icon": "string",            // Emoji icon
    "maxPoints": number,         // Maximum possible points
    "questions": [
      {
        "id": number,            // Question ID
        "text": "string",        // Question text
        "points": number         // Points for YES answer
      }
    ]
  }
]
```

**Sections**:
- `lower_back` - Lower Back assessment (15 maxPoints, 7 questions)
- `shoulder` - Shoulder assessment (11 maxPoints, 7 questions)
- `eyes` - Eyes assessment (9 maxPoints, 7 questions)
- `energy_focus` - Energy & Headache & Focus assessment (11 maxPoints, 7 questions)

**Scoring Logic**:
- Each YES answer adds points
- Normalized Score = (1 - totalPoints/maxPoints) × 100
- Results:
  - ≥80: "Good"
  - ≥60: "Needs Exercises"
  - <60: "See Doctor"

### 2. recommendations.json

Maps sections to recommendation types and provides recommendation cards.

**Purpose**: Displays personalized recommendation cards based on examination results.

**Structure**:
```json
{
  "sectionMapping": {
    "eyes": "eye",
    "lower_back": "lower-back",
    "shoulder": "neck-shoulders",
    "energy_focus": "headache-focus"
  },
  "recommendations": [
    {
      "title": "string",           // Card title
      "description": "string",     // Card description
      "image": "string",           // Image path
      "type": "string"             // Recommendation type
    }
  ]
}
```

**Recommendation Types**:
- `eye` - Eye exercises and tips
- `lower-back` - Lower back health
- `neck-shoulders` - Neck and shoulder care
- `headache-focus` - Headache and focus improvement

### 3. exercises-detailed.json

Comprehensive data for all recommendation types including exercises, tips, quick fixes, and reminders.

**Purpose**: Provides detailed content for each recommendation modal.

**Structure**:
```json
{
  "eye": {
    "exercises": [...]
  },
  "lower-back": {
    "officeTips": [...],
    "exercises": [...],
    "quickFixes": [...],
    "postureReminders": [...]
  },
  "neck-shoulders": {
    "officeTips": [...],
    "exercises": [...],
    "quickFixes": [...],
    "postureReminders": [...]
  },
  "headache-focus": {
    "officeTips": [...],
    "exercises": [...],
    "quickFixes": [...],
    "focusBoosters": [...],
    "postureReminders": [...]
  }
}
```

**Exercise Object**:
```json
{
  "emoji": "string",               // Visual indicator
  "title": "string",               // Exercise name
  "duration": "string",            // Time required
  "steps": ["string"],             // Step-by-step instructions
  "benefits": "string"             // Health benefits
}
```

**Office Tip Object**:
```json
{
  "icon": "string",                // Icon (usually "✔")
  "title": "string",               // Tip title
  "description": "string"          // Tip details
}
```

**Quick Fix/Reminder Object**:
```json
{
  "title": "string",               // Quick action
  "description": "string"          // Brief explanation
}
```

## 🔌 Service Integration

### ExaminationsService

**Updated Methods**:

```typescript
// Async method - waits for JSON to load
async getAllSections(): Promise<Section[]>

// Sync method - for backward compatibility
getAllSectionsSync(): Section[]
```

**Usage in Components**:

```typescript
// ✅ Correct - Async approach
async ngOnInit(): Promise<void> {
  this.sections = await this.examinationsService.getAllSections();
}

// ❌ Old approach (deprecated)
ngOnInit(): void {
  this.sections = this.examinationsService.getAllSectionsSync(); // May be empty!
}
```

### RecommendationsService (To be created)

A new service should be created to handle recommendations data:

```typescript
@Injectable({ providedIn: 'root' })
export class RecommendationsService {
  async getRecommendations(): Promise<Recommendation[]>
  async getExerciseDetails(type: string): Promise<ExerciseDetails>
}
```

## 🔄 Data Flow

1. **Component Initialization**:
   - Component calls `examinationsService.getAllSections()`
   - Service loads JSON file via HttpClient
   - Data is cached in service for future calls

2. **Examination Submission**:
   - User answers questions
   - Service calculates scores using loaded data structure
   - Results saved to localStorage

3. **Recommendations Display**:
   - Service reads examination history from localStorage
   - Calculates average scores per section
   - Filters and sorts recommendations based on scores
   - Loads detailed content from JSON when modal opens

## 📊 API Simulation

These JSON files simulate API endpoints:

| JSON File | Simulated Endpoint | HTTP Method |
|-----------|-------------------|-------------|
| examination-sections.json | `/api/physical/sections` | GET |
| recommendations.json | `/api/physical/recommendations` | GET |
| exercises-detailed.json | `/api/physical/exercises/{type}` | GET |

## 🚀 Future API Integration

To connect to a real API:

1. **Update service constants**:
```typescript
private readonly API_BASE = 'https://api.yourapp.com';
private readonly DATA_PATH = `${this.API_BASE}/physical/sections`;
```

2. **Add authentication headers**:
```typescript
this.http.get<Section[]>(this.DATA_PATH, {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

3. **Handle API errors**:
```typescript
catchError(error => {
  console.error('API Error:', error);
  return of([]); // Return fallback data
})
```

4. **Add loading states**:
```typescript
isLoading = true;
await this.service.getAllSections();
isLoading = false;
```

## 📝 Data Management

### Adding New Section

1. Add to `examination-sections.json`:
```json
{
  "id": "new_section",
  "name": "new_section",
  "displayName": "New Section",
  "icon": "🆕",
  "maxPoints": 10,
  "questions": [...]
}
```

2. Add mapping in `recommendations.json`:
```json
"sectionMapping": {
  "new_section": "new-recommendation-type"
}
```

3. Add exercises in `exercises-detailed.json`:
```json
"new-recommendation-type": {
  "exercises": [...],
  ...
}
```

### Modifying Questions

Update in `examination-sections.json`:
- Text can be changed freely
- Points should maintain relative importance
- maxPoints should equal sum of all question points

### Adding Exercises

Add to appropriate section in `exercises-detailed.json`:
```json
{
  "emoji": "🟢",
  "title": "New Exercise",
  "duration": "2 minutes",
  "steps": ["Step 1", "Step 2", "Step 3"],
  "benefits": "Benefits description"
}
```

## ⚠️ Important Notes

1. **Data Consistency**: Ensure section IDs match across all JSON files
2. **Caching**: Service caches data after first load
3. **Error Handling**: Service provides fallback for missing files
4. **Type Safety**: All interfaces defined in `models/examinations.models.ts`
5. **Backward Compatibility**: `getAllSectionsSync()` provided for components not yet updated

## 🧪 Testing

### Check Data Loading

```typescript
// In browser console
const service = inject(ExaminationsService);
const sections = await service.getAllSections();
console.log(sections);
```

### Verify JSON Structure

```bash
# Validate JSON syntax
npx jsonlint src/assets/data/physical/*.json
```

### Test File Paths

Open in browser:
- `http://localhost:4200/assets/data/physical/examination-sections.json`
- `http://localhost:4200/assets/data/physical/recommendations.json`
- `http://localhost:4200/assets/data/physical/exercises-detailed.json`

## 📈 Benefits of This Approach

1. **Separation of Concerns**: Data separated from logic
2. **Easy Updates**: Change content without touching code
3. **API Ready**: Minimal changes needed for real API
4. **Scalability**: Easy to add new sections/exercises
5. **Testing**: Can mock JSON responses
6. **Maintainability**: Content updates don't require code deployment
7. **Performance**: Data loaded once and cached
8. **Type Safety**: TypeScript interfaces ensure data integrity

## 🔗 Related Files

- **Services**: `src/app/services/examinations.service.ts`
- **Models**: `src/app/models/examinations.models.ts`
- **Components**: 
  - `src/app/Components/physical/examinations/`
  - `src/app/Components/physical/recommendations/`
