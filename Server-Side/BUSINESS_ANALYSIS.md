# Business Analysis Document
## Health & Wellness Web Application

---

## 1. Executive Summary

### Project Name
**WellnessHub** - A Comprehensive Health & Wellness Tracking Platform

### Project Description
A web-based application that enables users to monitor and improve their physical health, mental wellness, and nutrition through regular assessments, AI-powered analysis, gamified challenges, and educational resources.

### Business Objective
To provide an accessible, user-friendly platform that helps individuals take control of their overall health by combining physical, mental, and nutritional wellness tracking in one unified solution.

---

## 2. Problem Statement

### Current Challenges

| Problem | Impact |
|---------|--------|
| Sedentary lifestyle from desk jobs | Back pain, eye strain, poor posture affecting 80% of office workers |
| Neglected mental health | Increased stress, anxiety, and burnout in modern workforce |
| Lack of nutrition awareness | Poor dietary choices leading to health complications |
| Scattered health tools | Users need multiple apps for different health aspects |
| Low motivation for health goals | 92% of people fail to maintain health resolutions |

### Market Gap
No single platform currently combines:
- Physical health assessment
- Mental wellness tracking
- AI-powered nutrition analysis
- Gamified motivation system
- Educational health resources

---

## 3. Solution Overview

### Value Proposition
An all-in-one health platform that:
1. **Assesses** - Regular physical and mental health check-ups
2. **Analyzes** - AI-powered meal nutrition breakdown
3. **Motivates** - Gamified challenges with rewards
4. **Educates** - Comprehensive health library
5. **Tracks** - Personal dashboard with progress visualization

### Key Differentiators
- Holistic approach (Physical + Mental + Nutrition)
- AI integration for meal analysis
- Gamification with points and badges
- Modern, responsive design
- Privacy-focused (local storage)

---

## 4. Stakeholder Analysis

### Primary Stakeholders

| Stakeholder | Role | Interest |
|-------------|------|----------|
| End Users | Platform consumers | Improve personal health |
| Development Team | Build & maintain | Successful project delivery |
| Project Sponsor (DEPI) | Funding & oversight | Educational value |

### Secondary Stakeholders

| Stakeholder | Role | Interest |
|-------------|------|----------|
| Healthcare Professionals | Potential advisors | Accurate health information |
| Fitness Industry | Potential partners | User engagement |
| Corporate Wellness Programs | Potential clients | Employee health solutions |

---

## 5. Target Audience

### User Personas

#### Persona 1: Office Professional
- **Age**: 25-45
- **Pain Points**: Back pain, eye strain, stress
- **Goals**: Reduce work-related health issues
- **Tech Savvy**: High

#### Persona 2: Student
- **Age**: 18-25
- **Pain Points**: Sedentary habits, poor nutrition, exam stress
- **Goals**: Build healthy habits early
- **Tech Savvy**: Very High

#### Persona 3: Health Enthusiast
- **Age**: 20-50
- **Pain Points**: Tracking multiple health aspects
- **Goals**: Comprehensive health monitoring
- **Tech Savvy**: Medium-High

#### Persona 4: Remote Worker
- **Age**: 25-55
- **Pain Points**: Isolation, irregular schedule, poor posture
- **Goals**: Maintain health while working from home
- **Tech Savvy**: Medium-High

---

## 6. Functional Requirements

### FR-01: User Authentication
- User registration with profile details
- Secure login/logout
- Profile management

### FR-02: Physical Health Module
- 3-min, 6-min, 9-min health assessments
- Track: Lower back, Shoulder, Eyes, Energy
- History and analysis views
- Score-based recommendations

### FR-03: Mental Health Module
- Weekly mental health check-ups
- Track: Stress, Anxiety, Depression, Sleep, Social, Focus
- Trend analysis
- Professional consultation recommendations

### FR-04: Nutrition Module
- AI-powered meal photo analysis
- Nutritional breakdown (calories, proteins, carbs, fats, vitamins)
- Meal history tracking
- Daily value percentages

### FR-05: Challenges System
- Predefined health challenges
- Progress tracking
- Points and badges rewards
- Challenge categories (Physical, Mental, Nutrition)

### FR-06: Health Library
- Articles, exercises, tips
- Categorized content
- Search functionality

### FR-07: User Dashboard
- Personal health overview
- BMI calculation
- Health issues display
- Current challenges and badges

---

## 7. Non-Functional Requirements

### NFR-01: Performance
- Page load time < 3 seconds
- Smooth animations (60fps)
- Efficient localStorage operations

### NFR-02: Usability
- Intuitive navigation
- Mobile-responsive design
- Accessibility compliance
- Clear visual feedback

### NFR-03: Reliability
- Data persistence via localStorage
- Error handling and recovery
- Graceful degradation

### NFR-04: Security
- Password validation
- Input sanitization
- No sensitive data transmission (local-first)

### NFR-05: Maintainability
- Modular Angular architecture
- Clean code practices
- Comprehensive documentation

---

## 8. Use Cases

### UC-01: Complete Physical Examination
**Actor**: Registered User
**Precondition**: User is logged in
**Flow**:
1. User navigates to Physical → Examinations
2. User selects examination type (3/6/9 min)
3. User answers health questions
4. System calculates scores
5. System displays results and recommendations
6. System saves to history

### UC-02: Analyze Meal Nutrition
**Actor**: Registered User
**Precondition**: User is logged in
**Flow**:
1. User navigates to Nutrition
2. User uploads meal photo
3. System sends to Gemini AI
4. AI returns nutritional breakdown
5. User views calories, nutrients, daily values
6. User saves meal to history

### UC-03: Complete Challenge
**Actor**: Registered User
**Precondition**: User has active challenge
**Flow**:
1. User views challenge details
2. User marks daily progress
3. System updates points
4. Upon completion, system awards badge
5. Badge appears in user profile

### UC-04: View Health Issues
**Actor**: Registered User
**Precondition**: User has completed examinations
**Flow**:
1. User navigates to Profile
2. System reads examination history
3. System calculates section averages
4. Sections < 85% displayed as issues
5. User sees actionable health concerns

---

## 9. System Architecture

### Architecture Pattern
**Component-Based Architecture (Angular)**

```
┌─────────────────────────────────────────┐
│              Presentation Layer          │
│  (Components, Templates, Styles)         │
├─────────────────────────────────────────┤
│              Business Logic Layer        │
│  (Services, Models, Guards)              │
├─────────────────────────────────────────┤
│              Data Access Layer           │
│  (LocalStorage, HTTP Client)             │
├─────────────────────────────────────────┤
│              External Services           │
│  (Google Gemini AI API)                  │
└─────────────────────────────────────────┘
```

### Module Structure
```
App
├── Auth Module (Login, Register)
├── Physical Module (Examinations, Analysis)
├── Mental Module (Assessments, History)
├── Nutrition Module (Meal Logger, AI Analysis)
├── Challenges Module (List, Details, Progress)
├── Library Module (Articles, Exercises, Tips)
├── User Profile Module (Dashboard, Settings)
└── Shared Module (Navbar, Footer, Common)
```

---

## 10. Data Model

### User Profile
```
UserProfile {
  name: string
  email: string
  password: string
  age: number
  gender: 'male' | 'female'
  weight: number (kg)
  height: number (cm)
  photo: string (base64)
}
```

### Examination Record
```
WeeklyCheck {
  id: string
  date: Date
  selectedSections: string[]
  sectionResults: SectionResult[]
  totalScore: number
  overallResult: string
}
```

### Challenge
```
Challenge {
  id: number
  title: string
  description: string
  duration: string
  difficulty: string
  category: string
  points: number
  badge: Badge
}
```

---

## 11. Risk Analysis

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| AI API unavailability | Medium | High | Cache responses, fallback UI |
| Browser incompatibility | Low | Medium | Cross-browser testing |
| Data loss (localStorage) | Medium | High | Export/backup feature |
| User abandonment | Medium | Medium | Gamification, notifications |
| Health misinformation | Low | High | Disclaimer, professional advice |

---

## 12. Success Metrics

### KPIs (Key Performance Indicators)

| Metric | Target |
|--------|--------|
| User Registration Rate | 100+ during pilot |
| Daily Active Users | 40% of registered |
| Examination Completion Rate | 70% |
| Challenge Completion Rate | 50% |
| Average Session Duration | 5+ minutes |
| User Satisfaction Score | 4/5 stars |

---

## 13. Project Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Phase 1: Planning | 1 week | Requirements, Design |
| Phase 2: Core Development | 4 weeks | Auth, Physical, Mental modules |
| Phase 3: Feature Development | 3 weeks | Nutrition, Challenges, Library |
| Phase 4: Integration | 1 week | User Profile, Dashboard |
| Phase 5: Testing | 1 week | Bug fixes, Optimization |
| Phase 6: Deployment | 1 week | Launch, Documentation |

**Total Duration**: ~11 weeks

---

## 14. Budget Estimate

| Item | Cost |
|------|------|
| Development (Team) | Educational Project |
| Hosting (GitHub Pages) | Free |
| Gemini AI API | Free Tier |
| Domain (Optional) | ~$12/year |
| SSL Certificate | Free (Let's Encrypt) |

**Total**: Minimal cost (< $20/year)

---

## 15. Conclusion

### Summary
The Health & Wellness Web Application addresses a significant market gap by providing a comprehensive, user-friendly platform that combines physical health, mental wellness, and nutrition tracking with gamification elements to maintain user engagement.

### Recommendations
1. Launch MVP with core features
2. Gather user feedback
3. Iterate based on analytics
4. Consider mobile app version
5. Explore B2B opportunities (corporate wellness)

### Expected Outcomes
- Improved user health awareness
- Measurable health improvements
- Sustainable healthy habits
- Educational value demonstration
- Portfolio-worthy graduation project

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Prepared By**: Development Team  
**Project**: DEPI Graduation Project
