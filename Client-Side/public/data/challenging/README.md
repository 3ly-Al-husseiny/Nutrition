# Challenging Module Data

## Overview
This directory contains JSON data files for the **Challenging Module**, which helps users build healthy habits through 12 different health challenges.

## Data Files

### challenges.json
- **Description**: Contains all 12 health challenges with their properties
- **Location**: `public/data/challenging/challenges.json`
- **Usage**: Loaded by `ChallengeService` on initialization
- **Format**: Array of Challenge objects

#### Structure
```json
[
  {
    "id": number,
    "title": string,
    "icon": string (emoji),
    "description": string,
    "durationDays": number,
    "points": number
  }
]
```

#### Example
```json
{
  "id": 1,
  "title": "Drink 8 Glasses of Water",
  "icon": "💧",
  "description": "Stay hydrated by drinking 8 glasses (2 liters) of water every day",
  "durationDays": 7,
  "points": 50
}
```

## Available Challenges

### Nutrition-Related (4)
1. **Drink 8 Glasses of Water** - 7 days, 50 points
2. **No Junk Food** - 7 days, 60 points
3. **No Sugar Week** - 7 days, 70 points
4. **Cut Down on Soda** - 10 days, 55 points

### Habits (2)
5. **No Caffeine After 5 PM** - 7 days, 45 points
6. **No Smoking** - 7 days, 80 points

### Physical Activity (3)
7. **10,000 Steps per Day** - 7 days, 60 points
8. **30-Day Push-Up** - 30 days, 100 points
9. **Stretch for 10 Minutes** - 7 days, 45 points

### Mental Wellness (3)
10. **Digital-Free Before Bed** - 7 days, 50 points
11. **Meditate for 15 Minutes** - 7 days, 55 points
12. **Sleep 8 Hours Every Night** - 7 days, 60 points

## How Data is Loaded

### Service Implementation
The `ChallengeService` loads data asynchronously using HttpClient:

```typescript
private readonly DATA_PATH = 'data/challenging/challenges.json';
private challengesData: Challenge[] = [];
private dataLoaded = false;

private async loadChallengesFromJSON(): Promise<void> {
  try {
    this.challengesData = await firstValueFrom(
      this.http.get<Challenge[]>(this.DATA_PATH)
    );
    this.dataLoaded = true;
    console.log('✅ Challenges loaded from JSON:', this.challengesData.length);
  } catch (error) {
    console.error('❌ Error loading challenges from JSON:', error);
    this.challengesData = [];
    this.dataLoaded = true;
  }
}
```

### Component Usage
Components use async methods to access the data:

```typescript
async ngOnInit(): Promise<void> {
  this.availableChallenges = await this.challengeService.getAvailableChallenges();
}
```

## Data Flow

```
Application Start
     ↓
ChallengeService Constructor
     ↓
loadChallengesFromJSON()
     ↓
HTTP GET challenges.json
     ↓
Cache in challengesData[]
     ↓
Components Access via Async Methods
```

## Benefits of JSON Storage

### 1. **Separation of Concerns**
- Data separated from business logic
- Content updates without code changes
- Easier maintenance

### 2. **API Ready**
- Minimal changes needed for real API
- Already using HttpClient
- Async/await pattern in place

### 3. **Performance**
- Data cached after first load
- No repeated file reads
- Fast subsequent access

### 4. **Scalability**
- Easy to add new challenges
- Easy to modify existing challenges
- Modular structure

## Updating Challenge Data

### To Add a New Challenge:
1. Open `challenges.json`
2. Add a new object to the array with:
   - Unique `id` (next number in sequence)
   - Descriptive `title`
   - Relevant `icon` (emoji)
   - Clear `description`
   - `durationDays` (challenge length)
   - `points` (reward amount)
3. Save the file
4. Refresh the application

### To Modify Existing Challenge:
1. Open `challenges.json`
2. Find the challenge by `id`
3. Update the desired fields
4. Save the file
5. Clear browser cache if needed
6. Refresh the application

## User Data Storage

While challenge definitions are in JSON, user progress is stored in **LocalStorage**:

### Storage Key
```
challengesDetoxData
```

### Data Structure
```json
{
  "challenges": [
    {
      ...challenge_definition,
      "startedAt": "2025-11-29T09:00:00.000Z",
      "progress": [false, true, false, ...],
      "joined": true,
      "pointsEarned": 0
    }
  ],
  "user": {
    "badges": ["Bronze", "Silver"],
    "points": 450,
    "lastReminderShown": null
  }
}
```

## API Simulation

For future API integration, the structure is ready:

### Endpoint
```
GET /api/challenging/challenges
```

### Response Type
```typescript
Challenge[]
```

### Implementation
Simply change `DATA_PATH` from local file to API endpoint:
```typescript
// Current (Development)
private readonly DATA_PATH = 'data/challenging/challenges.json';

// Future (Production)
private readonly DATA_PATH = 'https://api.your-domain.com/challenging/challenges';
```

## Testing

### Verify Data Loading
1. Open browser console
2. Navigate to Challenging Module
3. Look for log message:
   ```
   ✅ Challenges loaded from JSON: 12
   ```

### Test File Accessibility
Open in browser:
```
http://localhost:4200/data/challenging/challenges.json
```

Should display the JSON data.

### Verify Functionality
1. Navigate to Challenging Module
2. Click on any challenge
3. Verify all 12 challenges appear
4. Join a challenge
5. Track progress

## Error Handling

If JSON file is missing or malformed:
- Service logs error to console
- Falls back to empty array
- Application continues to function
- User sees no challenges until file is fixed

## Version History

- **v1.0.0** (2025-11-29)
  - Initial migration from hardcoded TypeScript data
  - Created challenges.json
  - Updated ChallengeService to load from JSON
  - Updated all components to use async methods
  - Added to data index

---

**Module**: Challenging Health  
**Data Format**: JSON  
**Status**: ✅ Active  
**Last Updated**: 2025-11-29
