import { FoodItem } from '../types';

export const foodDatabase: FoodItem[] = [
  { id: '1', name: 'Roti / Chapati', nutritionPer100g: { calories: 297, protein: 9, carbs: 60, fat: 1.5, fiber: 9, sugar: 0 }, defaultUnit: 'roti', unitWeightInGrams: 40 },
  { id: '2', name: 'Cooked White Rice', nutritionPer100g: { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, sugar: 0.1 }, defaultUnit: 'katori', unitWeightInGrams: 150 },
  { id: '3', name: 'Dal Tadka', nutritionPer100g: { calories: 116, protein: 6, carbs: 16, fat: 4, fiber: 5, sugar: 1 }, defaultUnit: 'bowl', unitWeightInGrams: 200 },
  { id: '4', name: 'Paneer Butter Masala', nutritionPer100g: { calories: 250, protein: 8, carbs: 10, fat: 20, fiber: 2, sugar: 3 }, defaultUnit: 'bowl', unitWeightInGrams: 200 },
  { id: '5', name: 'Apple', nutritionPer100g: { calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, sugar: 10 }, defaultUnit: 'piece', unitWeightInGrams: 150 },
  { id: '6', name: 'Banana', nutritionPer100g: { calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, sugar: 12 }, defaultUnit: 'piece', unitWeightInGrams: 118 },
  { id: '7', name: 'Chicken Breast (Grilled)', nutritionPer100g: { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, sugar: 0 }, defaultUnit: 'piece', unitWeightInGrams: 150 },
  { id: '8', name: 'Pizza (Margherita)', nutritionPer100g: { calories: 266, protein: 11, carbs: 33, fat: 10, fiber: 2.3, sugar: 3.6 }, defaultUnit: 'slice', unitWeightInGrams: 100 },
  { id: '9', name: 'Pasta (Tomato Sauce)', nutritionPer100g: { calories: 131, protein: 5, carbs: 25, fat: 1.5, fiber: 2, sugar: 3 }, defaultUnit: 'bowl', unitWeightInGrams: 200 },
  { id: '10', name: 'Burger (Beef)', nutritionPer100g: { calories: 295, protein: 17, carbs: 24, fat: 14, fiber: 1.5, sugar: 5 }, defaultUnit: 'piece', unitWeightInGrams: 250 },
  { id: '11', name: 'Sushi (Salmon Roll)', nutritionPer100g: { calories: 143, protein: 5.5, carbs: 27, fat: 1.5, fiber: 0.5, sugar: 2 }, defaultUnit: 'piece', unitWeightInGrams: 30 },
  { id: '12', name: 'Tacos (Beef)', nutritionPer100g: { calories: 226, protein: 9, carbs: 20, fat: 12, fiber: 2.5, sugar: 1.5 }, defaultUnit: 'piece', unitWeightInGrams: 100 },
  { id: '13', name: 'Fried Rice (Vegetable)', nutritionPer100g: { calories: 163, protein: 3.5, carbs: 28, fat: 4, fiber: 1.5, sugar: 1 }, defaultUnit: 'bowl', unitWeightInGrams: 200 },
  { id: '14', name: 'Salad (Mixed Greens)', nutritionPer100g: { calories: 17, protein: 1.2, carbs: 3.3, fat: 0.2, fiber: 1.5, sugar: 1.5 }, defaultUnit: 'bowl', unitWeightInGrams: 100 },
  { id: '15', name: 'Idli', nutritionPer100g: { calories: 144, protein: 4.5, carbs: 30, fat: 0.4, fiber: 1.5, sugar: 0 }, defaultUnit: 'piece', unitWeightInGrams: 40 },
  { id: '16', name: 'Dosa (Plain)', nutritionPer100g: { calories: 168, protein: 3.5, carbs: 29, fat: 3.7, fiber: 0.9, sugar: 0 }, defaultUnit: 'piece', unitWeightInGrams: 100 },
  { id: '17', name: 'Poha', nutritionPer100g: { calories: 180, protein: 3.5, carbs: 35, fat: 2.5, fiber: 1.5, sugar: 1 }, defaultUnit: 'bowl', unitWeightInGrams: 150 },
  { id: '18', name: 'Curd / Dahi', nutritionPer100g: { calories: 98, protein: 3.5, carbs: 3.4, fat: 4.3, fiber: 0, sugar: 3.4 }, defaultUnit: 'katori', unitWeightInGrams: 100 },
  { id: '19', name: 'Milk (Whole)', nutritionPer100g: { calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, fiber: 0, sugar: 5 }, defaultUnit: 'glass', unitWeightInGrams: 250 },
  { id: '20', name: 'Almonds', nutritionPer100g: { calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12.5, sugar: 4.4 }, defaultUnit: 'piece', unitWeightInGrams: 1.2 },
];
