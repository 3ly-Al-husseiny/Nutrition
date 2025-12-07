// Contains all 12 health challenges with their details


import { Challenge } from '../models/challenge.model';


export const CHALLENGES_DATA: Challenge[] = [
    {
        id: 1,
        title: 'Drink 8 Glasses of Water',
        icon: '💧',
        description: 'Stay hydrated by drinking 8 glasses (2 liters) of water every day',
        durationDays: 7,
        points: 50
    },
    {
        id: 2,
        title: 'No Junk Food',
        icon: '🍔',
        description: 'Avoid processed and junk food for a full week',
        durationDays: 7,
        points: 60
    },
    {
        id: 3,
        title: 'No Sugar Week',
        icon: '🧊',
        description: 'Eliminate added sugar from your diet for 7 days',
        durationDays: 7,
        points: 70
    },

    {
        id: 4,
        title: 'Cut Down on Soda',
        icon: '🥤',
        description: 'Reduce or eliminate soda consumption for 10 days',
        durationDays: 10,
        points: 55
    },
    {
        id: 5,
        title: 'No Caffeine After 5 PM',
        icon: '☕',
        description: 'Avoid caffeine after 5 PM to improve sleep quality',
        durationDays: 7,
        points: 45
    },
    {
        id: 6,
        title: 'No Smoking',
        icon: '🚭',
        description: 'Stay smoke-free for 7 consecutive days',
        durationDays: 7,
        points: 80
    },

    {
        id: 7,
        title: '10,000 Steps per Day',
        icon: '🚶',
        description: 'Walk at least 10,000 steps every day for a week',
        durationDays: 7,
        points: 60
    },
    {
        id: 8,
        title: '30-Day Push-Up',
        icon: '💪',
        description: 'Complete daily push-ups for 30 days (start with your level)',
        durationDays: 30,
        points: 100
    },
    {
        id: 9,
        title: 'Stretch for 10 Minutes',
        icon: '🤸‍♀️',
        description: 'Dedicate 10 minutes each day to stretching exercises',
        durationDays: 7,
        points: 45
    },

    {
        id: 10,
        title: 'Digital-Free Before Bed',
        icon: '📱',
        description: 'No screens one hour before bedtime for better sleep',
        durationDays: 7,
        points: 50
    },
    {
        id: 11,
        title: 'Meditate for 15 Minutes',
        icon: '🧘',
        description: 'Practice mindfulness meditation for 15 minutes each day',
        durationDays: 7,
        points: 55
    },
    {
        id: 12,
        title: 'Sleep 8 Hours Every Night',
        icon: '💤',
        description: 'Get quality sleep of at least 8 hours every night',
        durationDays: 7,
        points: 60
    }
];

/**
 * Get a challenge by ID
 * @param id
 * @returns
 */
export function getChallengeById(id: number): Challenge | undefined {
    return CHALLENGES_DATA.find(challenge => challenge.id === id);
}

/**
 * Get all challenges
 * @returns
 */
export function getAllChallenges(): Challenge[] {
    return [...CHALLENGES_DATA];
}