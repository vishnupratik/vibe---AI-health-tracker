import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';
import { foodDatabase } from '../data/foodDatabase';
import { FoodItem, MealLogEntry } from '../types';
import { Camera, Search, X, Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { CameraView } from './CameraView';

interface AddFoodModalProps {
  mealCategory: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  date: string;
  onClose: () => void;
}

export function AddFoodModal({ mealCategory, date, onClose }: AddFoodModalProps) {
  const { addLog } = useAppStore();
  const [search, setSearch] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  const filteredFoods = foodDatabase.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!selectedFood) return;

    const ratio = (quantity * selectedFood.unitWeightInGrams) / 100;
    
    const log: MealLogEntry = {
      id: Math.random().toString(36).substring(7),
      date,
      timestamp: Date.now(),
      mealCategory,
      foodName: selectedFood.name,
      quantity,
      unit: selectedFood.defaultUnit,
      grams: quantity * selectedFood.unitWeightInGrams,
      nutrition: {
        calories: selectedFood.nutritionPer100g.calories * ratio,
        protein: selectedFood.nutritionPer100g.protein * ratio,
        carbs: selectedFood.nutritionPer100g.carbs * ratio,
        fat: selectedFood.nutritionPer100g.fat * ratio,
        fiber: selectedFood.nutritionPer100g.fiber * ratio,
        sugar: selectedFood.nutritionPer100g.sugar * ratio,
      }
    };

    addLog(log);
    onClose();
  };

  const handleAIResult = (result: any) => {
    // Result from Gemini
    const newFood: FoodItem = {
      id: 'ai-' + Date.now(),
      name: result.foodName,
      nutritionPer100g: result.nutritionPer100g,
      defaultUnit: result.estimatedPortion,
      unitWeightInGrams: result.portionInGrams,
    };
    setSelectedFood(newFood);
    setQuantity(1); // The AI already estimated the portion, so we set quantity to 1 of that portion
    setShowCamera(false);
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-nature-900/60 backdrop-blur-sm flex flex-col justify-end"
      >
        <motion.div 
          initial={{ y: '100%' }} 
          animate={{ y: 0 }} 
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-sand-100 rounded-t-[2rem] h-[85vh] flex flex-col overflow-hidden"
        >
          <div className="p-6 pb-4 flex justify-between items-center border-b border-nature-200/50">
            <h2 className="text-xl font-serif font-semibold text-nature-900">Add to {mealCategory}</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-nature-200/50 text-nature-700 transition">
              <X size={20} />
            </button>
          </div>

          {!selectedFood && !showCamera && (
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex gap-3 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-nature-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search food..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-nature-200 focus:ring-2 focus:ring-nature-400 outline-none shadow-sm"
                  />
                </div>
                <button 
                  onClick={() => setShowCamera(true)}
                  className="w-12 h-12 rounded-2xl bg-nature-800 text-white flex items-center justify-center hover:bg-nature-700 transition shadow-md"
                >
                  <Camera size={20} />
                </button>
              </div>

              <div className="space-y-3">
                {filteredFoods.map(food => (
                  <div 
                    key={food.id} 
                    onClick={() => setSelectedFood(food)}
                    className="bg-white p-4 rounded-2xl border border-nature-100 flex justify-between items-center cursor-pointer hover:border-nature-300 transition"
                  >
                    <div>
                      <h4 className="font-medium text-nature-900">{food.name}</h4>
                      <p className="text-sm text-nature-500">{food.nutritionPer100g.calories} kcal / 100g</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-sand-500/20 text-earth-800 flex items-center justify-center">
                      <Plus size={16} />
                    </div>
                  </div>
                ))}
                {filteredFoods.length === 0 && (
                  <p className="text-center text-nature-500 py-8">No foods found. Try the AI scanner!</p>
                )}
              </div>
            </div>
          )}

          {selectedFood && !showCamera && (
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex-1">
                <div className="bg-white p-6 rounded-3xl border border-nature-200 shadow-sm mb-6">
                  <h3 className="text-2xl font-serif font-semibold text-nature-900 mb-1">{selectedFood.name}</h3>
                  <p className="text-nature-500 mb-6">{selectedFood.nutritionPer100g.calories} kcal per 100g</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-nature-800 mb-2">Quantity</label>
                      <div className="flex items-center gap-4">
                        <input 
                          type="number" 
                          min="0.1" 
                          step="0.1"
                          value={quantity}
                          onChange={e => setQuantity(Number(e.target.value))}
                          className="w-24 p-3 rounded-xl border border-nature-200 text-center focus:ring-2 focus:ring-nature-400 outline-none"
                        />
                        <span className="text-nature-700 font-medium">{selectedFood.defaultUnit}</span>
                      </div>
                      <p className="text-xs text-nature-400 mt-2">
                        ≈ {Math.round(quantity * selectedFood.unitWeightInGrams)} grams
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Calories', value: Math.round(selectedFood.nutritionPer100g.calories * (quantity * selectedFood.unitWeightInGrams / 100)), unit: 'kcal' },
                    { label: 'Protein', value: Math.round(selectedFood.nutritionPer100g.protein * (quantity * selectedFood.unitWeightInGrams / 100)), unit: 'g' },
                    { label: 'Carbs', value: Math.round(selectedFood.nutritionPer100g.carbs * (quantity * selectedFood.unitWeightInGrams / 100)), unit: 'g' },
                    { label: 'Fat', value: Math.round(selectedFood.nutritionPer100g.fat * (quantity * selectedFood.unitWeightInGrams / 100)), unit: 'g' },
                  ].map(stat => (
                    <div key={stat.label} className="bg-nature-50 p-3 rounded-2xl text-center border border-nature-100">
                      <span className="block text-xs text-nature-500 mb-1">{stat.label}</span>
                      <span className="block font-semibold text-nature-900">{stat.value}<span className="text-[10px] font-normal ml-0.5">{stat.unit}</span></span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedFood(null)}>Cancel</Button>
                <Button className="flex-1" onClick={handleSave}>Save Entry</Button>
              </div>
            </div>
          )}

          {showCamera && (
            <CameraView 
              onClose={() => setShowCamera(false)} 
              onResult={handleAIResult} 
            />
          )}

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
