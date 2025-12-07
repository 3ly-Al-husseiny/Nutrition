// Defines the structure for user data and progress

import { ChallengeBadge } from './challenge.model';

// User data structure
export interface UserData {
    badges: string[]; // Legacy: keeping for backward compatibility
    challengeBadges?: ChallengeBadge[]; // New: challenge-specific badges
    points: number;
    lastReminderShown: string | null;
}

// Storage data structure
export interface StorageData {
    challenges: any[];
    user: UserData;
}

// Badge types (Legacy)
export type BadgeType = 'Bronze' | 'Silver' | 'Gold';

// Badge information (Legacy)
export interface Badge {
    name: BadgeType;
    icon: string;
    requiredChallenges: number;
}
