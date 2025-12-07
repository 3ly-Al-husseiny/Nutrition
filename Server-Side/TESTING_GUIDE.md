# Login/Registration System - Testing Guide

## Overview
This system implements a complete authentication flow with:
- User Registration with Email, Password, Full Name, Weight, Height
- Login validation against stored users
- Dynamic Profile display with BMI calculation
- Settings page to update user information
- JSON-based storage using localStorage

## Features Implemented

### 1. **Registration System** (`/register`)
**Fields Required:**
- Full Name
- Email (must be unique)
- Password (minimum 6 characters)
- Weight (in kg)
- Height (in cm)

**Functionality:**
- Validates all fields
- Checks for duplicate emails
- Stores user data in localStorage under the key `registered_users`
- Redirects to login page after successful registration
- Shows error/success messages

### 2. **Login System** (`/login`)
**Fields:**
- Email
- Password

**Functionality:**
- Validates credentials against stored users in localStorage
- Shows error message for invalid credentials
- Sets current user session on successful login
- Redirects to physical page after login

### 3. **Profile Page** (`/user-profile`)
**Dynamic Display:**
- Full Name
- Age
- Gender
- Weight (kg)
- Height (cm)
- **BMI (Automatically Calculated)** with category (Underweight/Normal/Overweight/Obese)

**BMI Calculation:**
```
BMI = weight (kg) / (height in meters)²
```

**BMI Categories:**
- < 18.5: Underweight
- 18.5 - 24.9: Normal
- 25 - 29.9: Overweight
- >= 30: Obese

### 4. **Settings Page** (`/settings`)
**Editable Fields:**
- Name
- Email
- Age
- Gender
- Weight (kg)
- Height (cm)
- Profile Photo (upload)

**Functionality:**
- Updates both localStorage and authentication service
- Syncs changes across all components
- Shows success/error notifications
- Can cancel changes to revert to original values

## Data Storage Structure

### LocalStorage Keys:

1. **`registered_users`** - Array of all registered users
```json
[
  {
    "email": "user@example.com",
    "password": "password123",
    "profile": {
      "name": "John Doe",
      "email": "user@example.com",
      "password": "password123",
      "weight": 70,
      "height": 175,
      "age": 25,
      "gender": "male",
      "photo": "https://ui-avatars.com/api/..."
    }
  }
]
```

2. **`currentUserEmail`** - Email of currently logged-in user
```
"user@example.com"
```

3. **`userProfile`** - Current user's profile data
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "weight": 70,
  "height": 175,
  "age": 25,
  "gender": "male",
  "photo": "https://ui-avatars.com/api/..."
}
```

4. **`isLoggedIn`** - Login state flag
```
"true"
```

## Testing Instructions

### Test Case 1: New User Registration
1. Navigate to `/register`
2. Fill in the form:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Password: "test123"
   - Weight: 70
   - Height: 175
3. Click "Register"
4. Should see success message and redirect to login

### Test Case 2: Duplicate Email Registration
1. Try to register with the same email again
2. Should see error: "Email already registered"

### Test Case 3: Login with Valid Credentials
1. Navigate to `/login`
2. Enter:
   - Email: "test@example.com"
   - Password: "test123"
3. Click "Login"
4. Should redirect to `/physical`

### Test Case 4: Login with Invalid Credentials
1. Navigate to `/login`
2. Enter wrong email or password
3. Should see error: "Invalid email or password"

### Test Case 5: View Profile with BMI
1. After logging in, navigate to `/user-profile`
2. Should see all user information including:
   - Weight: 70 kg
   - Height: 175 cm
   - BMI: 22.9 (Normal)

### Test Case 6: Update Profile in Settings
1. Navigate to `/settings`
2. Change weight to 80
3. Click "Save Changes"
4. Navigate back to `/user-profile`
5. BMI should update to 26.1 (Overweight)

### Test Case 7: Logout and Re-login
1. Click logout (if available in navbar)
2. Should redirect to `/login`
3. Login again with same credentials
4. Profile data should persist

## Inspect Data in Browser

To view stored data:
1. Open Browser DevTools (F12)
2. Go to Application/Storage tab
3. Select Local Storage
4. View the keys: `registered_users`, `currentUserEmail`, `userProfile`, `isLoggedIn`

## Services Architecture

### 1. **AuthService** (`auth.service.ts`)
- Handles registration, login, logout
- Manages user storage in localStorage
- Validates credentials
- Updates user profiles

### 2. **UserProfileService** (`user-profile.service.ts`)
- Manages current user profile state
- Calculates BMI
- Provides BMI categories
- Syncs profile data

### 3. **LoginAuth** (`login-auth.ts`)
- Manages login state
- Handles navigation after login/logout

### 4. **RegisterAuth** (`register-auth.ts`)
- Original multi-step registration (kept for compatibility)
- Can be removed if not needed

## Integration Points

### Profile ↔ Settings
- Settings updates sync to Profile automatically
- Both use the same UserProfileService
- Changes in Settings immediately reflect in Profile

### Login ↔ AuthService
- Login validates against AuthService stored users
- Sets current user session
- Manages authentication state

### Registration ↔ AuthService
- Registration stores new user in AuthService
- Validates unique email
- Creates default profile values for age/gender

## Default Values

When registering, the following defaults are set:
- Age: 25
- Gender: "other"
- Photo: Auto-generated avatar based on name

These can be updated in Settings after registration.

## BMI Calculation Example

For a user with:
- Weight: 70 kg
- Height: 175 cm

Calculation:
```
Height in meters = 175 / 100 = 1.75 m
BMI = 70 / (1.75 × 1.75)
BMI = 70 / 3.0625
BMI = 22.9 (Normal)
```

## File Structure

```
src/app/
├── services/
│   ├── auth/
│   │   ├── auth.service.ts          (NEW - Main auth service)
│   │   ├── login-auth.ts             (Updated)
│   │   └── register-auth.ts          (Kept for compatibility)
│   └── user-profile.service.ts       (Updated with BMI calculation)
├── Components/
│   ├── auth/
│   │   ├── login/
│   │   │   ├── login-page.ts        (Updated with validation)
│   │   │   ├── login-page.html      (Updated with alerts)
│   │   │   └── login-page.css       (Updated with alert styles)
│   │   └── register/
│   │       ├── register-page.ts     (Simplified to single page)
│   │       ├── register-page.html   (Updated with required fields)
│   │       └── register-page.css    (Updated with alert styles)
│   ├── settings/
│   │   ├── settings.ts              (Updated with weight/height)
│   │   └── settings.html            (Updated with new fields)
│   └── user-profile/
│       └── personal-info/
│           ├── personal-info.ts     (Updated with BMI calculation)
│           ├── personal-info.html   (Updated to display BMI)
│           └── personal-info.css    (Updated with BMI category style)
```

## Notes

- All data is stored in localStorage (browser storage)
- Data persists across page refreshes
- Clearing browser data will remove all users
- No backend server required for testing
- Password is stored in plain text (for testing only - not production-ready)
- BMI is recalculated whenever weight or height changes
