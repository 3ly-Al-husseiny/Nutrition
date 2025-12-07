/** Represents a single nutritional element */
export interface NutrientElement {
  name: string;        // e.g., 'Vitamin C', 'Protein', 'Sodium'
  amount: number;      // Quantity
  unit: string;        // e.g., 'mg', 'g', 'mcg'
  dailyValue?: number; // Optional: % of daily recommended value
}

/** Gemini API analysis result for a meal */
export interface MealAnalysis {
  elements: NutrientElement[];     // All extracted nutrients
  calories: number;                 // Total calories
  servingSize?: string;             // e.g., '1 cup', '200g'
  confidence?: number;              // AI confidence score (0-1)
}

/** Complete meal entry stored in Local Storage */
export interface MealEntry {
  id: string;                    // Unique ID (UUID)
  description: string;           // User's meal description
  date: Date;                    // When meal was logged
  timestamp: number;             // Unix timestamp for sorting
  analysis: MealAnalysis;        // Gemini's nutritional analysis
}

/** Average element across all meals */
export interface ElementAverage {
  name: string;
  averageAmount: number;
  unit: string;
  totalMeals: number;           // How many meals contained this element
  averageDailyValue?: number;   // Average % of daily value
}
