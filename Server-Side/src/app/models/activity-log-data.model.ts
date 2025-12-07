export interface ActivityLog {
  id: number;
  activityType: 'meal' | 'exercise' | 'sleep' | 'water';
  date: Date;
  
  // Meal Specific Data
  mealType?: string;
  foodItems?: string;
  
  // Exercise Specific Data
  exerciseType?: string;
  duration?: number; // Minutes
  intensity?: string;
  
  // Sleep Specific Data
  bedTime?: string;
  wakeTime?: string;
  sleepQuality?: string;
  sleepNotes?: string;
  
  // Water Specific Data
  waterGlasses?: number;
}