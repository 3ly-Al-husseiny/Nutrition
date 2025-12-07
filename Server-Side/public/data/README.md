# Application Data Structure

This directory contains all static data for the application modules, organized to simulate API endpoints for testing and development.

## 📂 Directory Organization

```
src/assets/data/
├── physical/                    # Physical health module data
│   ├── examination-sections.json
│   ├── recommendations.json
│   ├── exercises-detailed.json
│   └── README.md
├── mental/                      # Mental health module data
│   ├── examination-sections.json
│   └── README.md (to be created)
├── challenging/                 # Challenging module data
│   ├── challenges.json
│   └── README.md
├── library/                     # Resource library data
│   └── resources.json
├── nutrition/                   # Nutrition module data (planned)
│   └── ...
└── README.md                    # This file
```

## 🎯 Purpose

This data structure serves multiple purposes:

1. **API Simulation**: Test application behavior with realistic data before backend is ready
2. **Development**: Rapid prototyping without backend dependencies
3. **Testing**: Consistent test data across environments
4. **Documentation**: Clear data structure reference for backend API design
5. **Offline Mode**: Application can function without network connectivity

## 📊 Current Modules

### Physical Health Module ✅ 
**Status**: Fully Implemented  
**Location**: `physical/`  
**Components**:
- 4 examination sections with 28 health questions
- Exercise recommendations and office ergonomics tips
- 100+ exercises, tips, and quick health fixes

**Services**: `ExaminationsService`

[View Physical Module Documentation](./physical/README.md)

### Mental Health Module ✅
**Status**: Fully Implemented
**Location**: `mental/`  
**Components**:
- 6 examination sections with 42 mental health questions
- Stress, focus, motivation, sleep, emotional wellbeing, and digital overuse assessments

**Services**: `MentalService`

[View Mental Module Documentation](#) *(to be created)*

### Library Module ✅
**Status**: Already Implemented (Using JSON)  
**Location**: `library/`  
**Components**:
- 17 wellness resources across 4 categories
- Articles, videos, podcasts, guides, and websites
- Filtering, search, sorting, and recommendation engine

**Services**: `ResourceApi`, `LibraryStore`

[View Library Module Documentation](#) *(to be created)*

### Mental Health Module 🚧
**Status**: Planned  
**Location**: `mental/` (to be created)  
**Planned Data**:
- Mental health assessments
- Stress management techniques
- Mindfulness exercises
- Mood tracking categories

### Nutrition Module 🚧
**Status**: Planned  
**Location**: `nutrition/` (to be created)  
**Planned Data**:
- Meal plans
- Nutritional guidelines
- Recipe database
- Dietary recommendations

## 🔧 Implementation Pattern

Each module follows a consistent pattern:

### 1. Data Files Structure
```
module/
├── {entity}-data.json          # Main entity data
├── {details}-data.json         # Detailed information
├── config.json                 # Module configuration
└── README.md                   # Module documentation
```

### 2. Service Integration
```typescript
@Injectable({ providedIn: 'root' })
export class ModuleService {
  private readonly DATA_PATH = 'assets/data/module/';
  private cache: Map<string, any> = new Map();

  constructor(private http: HttpClient) {}

  async loadData<T>(filename: string): Promise<T> {
    if (this.cache.has(filename)) {
      return this.cache.get(filename);
    }
    
    const data = await firstValueFrom(
      this.http.get<T>(`${this.DATA_PATH}${filename}`)
    );
    
    this.cache.set(filename, data);
    return data;
  }
}
```

### 3. Component Usage
```typescript
export class Component implements OnInit {
  data: any;

  async ngOnInit(): Promise<void> {
    this.data = await this.service.loadData('file.json');
  }
}
```

## 🌐 API Migration Path

When transitioning to a real API, follow these steps:

### Phase 1: Configuration
Create environment-specific API URLs:
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'assets/data',  // Local JSON files
  apiVersion: 'v1'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.yourapp.com',  // Real API
  apiVersion: 'v1'
};
```

### Phase 2: Service Abstraction
```typescript
export class DataService {
  private baseUrl = environment.apiUrl;

  async get<T>(endpoint: string): Promise<T> {
    return firstValueFrom(
      this.http.get<T>(`${this.baseUrl}/${endpoint}`)
    );
  }
}
```

### Phase 3: Gradual Migration
- Start with one module
- Test thoroughly
- Monitor performance
- Migrate remaining modules

## 📝 Data Management Guidelines

### File Naming Convention
- Use kebab-case: `exercise-details.json`
- Be descriptive: `user-examination-history.json`
- Group related data: `exercises/cardio.json`

### JSON Structure
- Use consistent property names
- Include metadata (version, lastUpdated)
- Document complex structures
- Validate with JSON Schema (optional)

### Example with Metadata
```json
{
  "metadata": {
    "version": "1.0.0",
    "lastUpdated": "2025-11-26",
    "description": "Physical examination sections"
  },
  "data": [
    // Actual data here
  ]
}
```

## 🔐 Data Security

### Current Approach (Development)
- All data is public (in `assets/`)
- No sensitive information stored
- Suitable for prototyping only

### Production Considerations
- Move sensitive data to backend API
- Implement authentication/authorization
- Use HTTPS for all API calls
- Implement rate limiting

## 🧪 Testing Data

### Development Data
Location: Current JSON files  
Purpose: Development and testing  
Update Frequency: As needed

### Mock Data
Location: `src/testing/fixtures/` (to be created)  
Purpose: Unit and integration tests  
Format: Smaller subsets of real data

### Production Data
Location: Backend database  
Purpose: Real user data  
Access: Via authenticated API

## 📈 Performance Optimization

### Current Optimizations
1. **Lazy Loading**: Data loaded only when needed
2. **Caching**: Services cache loaded JSON
3. **Small Files**: Data split into focused files

### Future Optimizations
1. **Compression**: Gzip JSON files
2. **CDN**: Serve static data from CDN
3. **Pagination**: For large datasets
4. **Incremental Updates**: Only fetch changed data

## 🛠️ Development Tools

### Validate JSON Syntax
```bash
npx jsonlint src/assets/data/**/*.json
```

### Format JSON Files
```bash
npx prettier --write "src/assets/data/**/*.json"
```

### Generate TypeScript Interfaces
```bash
npx json-schema-to-typescript src/assets/data/schema.json
```

## 📚 Documentation

Each module should include:
- **README.md**: Module overview and data structure
- **Examples**: Sample usage in comments
- **Schema**: Data validation schema (optional)
- **Changelog**: Version history

## 🤝 Contributing

When adding new data:

1. Create module directory in `data/`
2. Add JSON files following naming convention
3. Create service to load data
4. Update this README with module information
5. Add module-specific README
6. Test data loading in components

## 🔗 Related Documentation

- [Physical Module Data](./physical/README.md)
- [Service Architecture](../../services/README.md) (to be created)
- [API Design Guidelines](../../../docs/API.md) (to be created)

## ❓ FAQ

**Q: Why JSON files instead of database?**  
A: For development and testing without backend dependency. Production will use real API.

**Q: Can I modify JSON files while app is running?**  
A: Changes require page refresh as data is cached after first load.

**Q: How do I add a new data field?**  
A: Update JSON file, update TypeScript interface, restart app.

**Q: What's the file size limit?**  
A: Keep individual JSON files under 1MB for optimal loading.

**Q: Can I nest data in subdirectories?**  
A: Yes, just update the DATA_PATH in your service accordingly.

## 📞 Support

For questions about data structure:
1. Check module-specific README first
2. Review service implementation
3. Check browser console for loading errors
4. Validate JSON syntax

## 🗺️ Roadmap

- [x] Physical Module data structure
- [x] Mental Module data structure
- [x] Challenging Module data structure
- [ ] Nutrition Module data structure
- [ ] Central data service
- [ ] JSON schema validation
- [ ] Data versioning system
- [ ] Migration scripts for API transition
