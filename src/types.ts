export type ActivityLevel = 'sedentary' | 'lightly_active' | 'active' | 'athlete';
export type DietaryPreference = 'vegetarian' | 'eggetarian' | 'non_vegetarian' | 'vegan';
export type PrimaryGoal = 'weight_loss' | 'maintain_weight' | 'muscle_gain' | 'general_health';
export type EatingPattern = 'home_cooked' | 'mixed' | 'outside_food';

export interface UserProfile {
  name: string;
  height: number; // cm
  weight: number; // kg
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: ActivityLevel;
  dietaryPreference: DietaryPreference;
  primaryGoal: PrimaryGoal;
  eatingPattern: EatingPattern;
  dailyCalorieTarget: number;
  dailyWaterTarget: number; // ml
  exerciseReminderTime?: string; // HH:mm
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  vitaminC?: number;
  calcium?: number;
  iron?: number;
  potassium?: number;
  sodium?: number;
}

export interface FoodItem {
  id: string;
  name: string;
  nutritionPer100g: Nutrition;
  defaultUnit: string;
  unitWeightInGrams: number;
}

export interface MealLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: number;
  mealCategory: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  foodName: string;
  quantity: number;
  unit: string;
  grams: number;
  nutrition: Nutrition; // Calculated for the specific portion
}

export interface ExerciseLogEntry {
  id: string;
  date: string;
  timestamp: number;
  exerciseName: string;
  durationMinutes: number;
  caloriesBurned: number;
}

export interface WaterLogEntry {
  id: string;
  date: string;
  timestamp: number;
  amountMl: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  dateEarned: string;
}

export interface GamificationState {
  points: number;
  currentStreak: number;
  longestStreak: number;
  lastLogDate: string | null;
  badges: Badge[];
}

