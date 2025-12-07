// Defines the structure for user data and progress

// User data structure
export interface UserData {
    badges: string[];
    points: number;
    lastReminderShown: string | null;
}

// Storage data structure
export interface StorageData {
    challenges: any[];
    user: UserData;
}

// Badge types
export type BadgeType = 'Bronze' | 'Silver' | 'Gold';

// Badge information
export interface Badge {
    name: BadgeType;
    icon: string;
    requiredChallenges: number;
}
