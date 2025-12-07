// Defines the structure for challenge data

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
}

// Challenge statistics
export interface ChallengeStats {
    completed: number;
    total: number;
    percentage: number;
}