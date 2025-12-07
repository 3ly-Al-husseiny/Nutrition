// Defines the structure for challenge data

// Badge awarded upon challenge completion
export interface ChallengeBadge {
    name: string;
    icon: string;
    color: string;
    challengeId: number;
    challengeTitle: string;
    dateEarned?: string;
}

// challenge definition
export interface Challenge {
    id: number;
    title: string;
    icon: string;
    description: string;
    durationDays: number;
    points: number;
}

// User's active challenge with progress tracking
export interface UserChallenge extends Challenge {
    startedAt: string;
    progress: boolean[];
    joined: boolean;
    pointsEarned: number;
    badgeEarned?: boolean;
}

// Challenge statistics
export interface ChallengeStats {
    completed: number;
    total: number;
    percentage: number;
}