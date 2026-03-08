import { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { Card } from './ui/Card';
import { ProgressRing } from './ui/ProgressRing';
import { format } from 'date-fns';
import { Activity, Utensils, Droplets, Flame, Plus, Award, Trophy, Zap, GlassWater, Sparkles } from 'lucide-react';
import { AddFoodModal } from './AddFoodModal';
import { MonthlyReport } from './MonthlyReport';
import { AddExerciseModal } from './AddExerciseModal';
import { DailyInsightsModal } from './DailyInsightsModal';

export function Dashboard() {
  const { profile, logs, exerciseLogs, waterLogs, gamification, awardBadge, addWaterLog } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddingFood, setIsAddingFood] = useState<string | null>(null);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showInsights, setShowInsights] = useState(false);

  if (!profile) return null;

  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const todaysLogs = logs.filter(l => l.date === dateStr);
  const todaysExercise = exerciseLogs.filter(l => l.date === dateStr);
  const todaysWater = waterLogs.filter(l => l.date === dateStr);

  const totalCalories = todaysLogs.reduce((sum, log) => sum + log.nutrition.calories, 0);
  const totalProtein = todaysLogs.reduce((sum, log) => sum + log.nutrition.protein, 0);
  const totalCarbs = todaysLogs.reduce((sum, log) => sum + log.nutrition.carbs, 0);
  const totalFat = todaysLogs.reduce((sum, log) => sum + log.nutrition.fat, 0);
  const totalCaloriesBurned = todaysExercise.reduce((sum, log) => sum + log.caloriesBurned, 0);
  const totalWaterMl = todaysWater.reduce((sum, log) => sum + log.amountMl, 0);

  const adjustedTarget = profile.dailyCalorieTarget + totalCaloriesBurned;
  const progress = Math.min((totalCalories / adjustedTarget) * 100, 100);
  const isOverLimit = totalCalories > adjustedTarget;

  const mealCategories = ['Breakfast', 'Lunch', 'Dinner', 'Snack'] as const;

  useEffect(() => {
    if (gamification.currentStreak >= 3) awardBadge('streak_3', '3 Day Streak', 'Logged for 3 consecutive days', '🔥');
    if (gamification.currentStreak >= 7) awardBadge('streak_7', '7 Day Streak', 'Logged for 7 consecutive days', '🔥');
    if (totalWaterMl >= profile.dailyWaterTarget) awardBadge('water_goal', 'Hydration Hero', 'Met daily water goal', '💧');
    if (totalCalories <= adjustedTarget && totalCalories > adjustedTarget * 0.8) awardBadge('calorie_goal', 'Target Hit', 'Met daily calorie goal', '🎯');
  }, [gamification.currentStreak, totalWaterMl, totalCalories, adjustedTarget, profile.dailyWaterTarget]);

  const handleAddWater = (amount: number) => {
    addWaterLog({
      id: Math.random().toString(36).substring(7),
      date: dateStr,
      timestamp: Date.now(),
      amountMl: amount
    });
  };

  return (
    <div className="min-h-screen bg-sand-100 pb-24">
      {/* Header Section */}
      <div className="bg-nature-900 text-sand-100 pt-12 pb-8 px-6 rounded-b-[3rem] relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-nature-700/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-nature-800/40 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div>
              <p className="text-nature-400 text-xs font-bold uppercase tracking-widest mb-1">Vibe</p>
              <h1 className="text-2xl font-serif font-semibold tracking-wide">
                {currentDate.getHours() < 12 ? 'Good morning' : currentDate.getHours() < 18 ? 'Good afternoon' : 'Good evening'}, {profile.name} 👋
              </h1>
              <p className="text-nature-300 text-sm mt-1">{format(currentDate, 'EEEE, MMMM d')}</p>
            </div>
            <div className="flex gap-2">
              <button className="h-10 px-4 rounded-full bg-nature-800 flex items-center gap-2 border border-nature-700">
                <Flame size={16} className="text-orange-400" />
                <span className="text-sm font-medium">{gamification.currentStreak}</span>
              </button>
              <button onClick={() => setShowReport(true)} className="w-10 h-10 rounded-full bg-nature-800 flex items-center justify-center border border-nature-700 hover:bg-nature-700 transition">
                <Activity size={18} className="text-nature-200" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="relative flex items-center justify-center">
              <ProgressRing 
                radius={60} 
                stroke={8} 
                progress={progress} 
                color={isOverLimit ? '#ef4444' : 'var(--color-nature-400)'} 
                trackColor="rgba(255,255,255,0.1)"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold">{Math.round(totalCalories)}</span>
                <span className="text-[10px] text-nature-300 uppercase tracking-wider">/ {Math.round(adjustedTarget)}</span>
              </div>
            </div>
            
            <div className="flex-1 ml-8 grid grid-cols-3 gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-nature-400 mb-1 flex items-center gap-1"><Utensils size={10}/> Protein</span>
                <span className="font-medium">{Math.round(totalProtein)}g</span>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-earth-300 rounded-full" style={{ width: `${Math.min((totalProtein/150)*100, 100)}%` }} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-nature-400 mb-1 flex items-center gap-1"><Flame size={10}/> Carbs</span>
                <span className="font-medium">{Math.round(totalCarbs)}g</span>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-sand-500 rounded-full" style={{ width: `${Math.min((totalCarbs/250)*100, 100)}%` }} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-nature-400 mb-1 flex items-center gap-1"><Droplets size={10}/> Fat</span>
                <span className="font-medium">{Math.round(totalFat)}g</span>
                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-nature-500 rounded-full" style={{ width: `${Math.min((totalFat/70)*100, 100)}%` }} />
                </div>
              </div>
            </div>
          </div>
          
          {isOverLimit ? (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm flex items-center gap-2">
              <Activity size={16} />
              Careful, {profile.name}! You've exceeded your adjusted daily target of {Math.round(adjustedTarget)} kcal.
            </div>
          ) : progress > 80 ? (
            <div className="mt-4 p-3 bg-nature-500/20 border border-nature-500/30 rounded-xl text-nature-200 text-sm flex items-center gap-2">
              <Activity size={16} />
              You're doing great today, {profile.name}! Keep it up.
            </div>
          ) : null}
        </div>
      </div>

      <div className="px-6 -mt-6 relative z-20 space-y-4">
        {/* Gamification Badges */}
        {gamification.badges.length > 0 && (
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {gamification.badges.slice(-5).reverse().map(badge => (
              <div key={badge.id} className="bg-white px-4 py-2 rounded-full shadow-sm border border-nature-100 flex items-center gap-2 whitespace-nowrap">
                <span className="text-lg">{badge.icon}</span>
                <span className="text-sm font-medium text-nature-900">{badge.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Water Tracking */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <Droplets size={20} />
              </div>
              <div>
                <h3 className="font-medium text-nature-900">Hydration</h3>
                <p className="text-sm text-nature-500">{totalWaterMl} / {profile.dailyWaterTarget} ml</p>
              </div>
            </div>
          </div>
          <div className="w-full h-2 bg-nature-50 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 rounded-full transition-all" style={{ width: `${Math.min((totalWaterMl/profile.dailyWaterTarget)*100, 100)}%` }} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleAddWater(250)} className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition flex items-center justify-center gap-1">
              <GlassWater size={14} /> +250ml
            </button>
            <button onClick={() => handleAddWater(500)} className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 text-sm font-medium hover:bg-blue-100 transition flex items-center justify-center gap-1">
              <Droplets size={14} /> +500ml
            </button>
          </div>
        </Card>

        {/* Exercise Tracking */}
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="font-medium text-nature-900">Exercise</h3>
                <p className="text-sm text-nature-500">{Math.round(totalCaloriesBurned)} kcal burned</p>
              </div>
            </div>
            <button 
              onClick={() => setIsAddingExercise(true)}
              className="w-8 h-8 rounded-full bg-sand-500/20 text-earth-800 flex items-center justify-center hover:bg-sand-500/40 transition"
            >
              <Plus size={16} />
            </button>
          </div>
          {todaysExercise.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-nature-100">
              {todaysExercise.map(log => (
                <div key={log.id} className="flex justify-between items-center text-sm">
                  <div className="flex flex-col">
                    <span className="text-nature-800">{log.exerciseName}</span>
                    <span className="text-nature-400 text-xs">{log.durationMinutes} min</span>
                  </div>
                  <span className="font-medium text-nature-700">{Math.round(log.caloriesBurned)} kcal</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Meals Section */}
        {mealCategories.map(meal => {
          const mealLogs = todaysLogs.filter(l => l.mealCategory === meal);
          const mealCals = mealLogs.reduce((sum, l) => sum + l.nutrition.calories, 0);

          return (
            <Card key={meal} className="p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-nature-50 flex items-center justify-center text-nature-700">
                    {meal === 'Breakfast' ? '🌅' : meal === 'Lunch' ? '☀️' : meal === 'Dinner' ? '🌙' : '🍎'}
                  </div>
                  <div>
                    <h3 className="font-medium text-nature-900">{meal}</h3>
                    <p className="text-sm text-nature-500">{Math.round(mealCals)} kcal</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAddingFood(meal)}
                  className="w-8 h-8 rounded-full bg-sand-500/20 text-earth-800 flex items-center justify-center hover:bg-sand-500/40 transition"
                >
                  <Plus size={16} />
                </button>
              </div>

              {mealLogs.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-nature-100">
                  {mealLogs.map(log => (
                    <div key={log.id} className="flex justify-between items-center text-sm">
                      <div className="flex flex-col">
                        <span className="text-nature-800">{log.foodName}</span>
                        <span className="text-nature-400 text-xs">{log.quantity} {log.unit}</span>
                      </div>
                      <span className="font-medium text-nature-700">{Math.round(log.nutrition.calories)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}

        {/* Daily Insights Button */}
        {todaysLogs.length > 0 && (
          <button 
            onClick={() => setShowInsights(true)}
            className={`w-full mt-4 p-4 rounded-2xl shadow-lg flex items-center justify-between hover:shadow-xl transition-all active:scale-[0.98] ${
              currentDate.getHours() >= 20 
                ? 'bg-gradient-to-r from-nature-600 to-nature-800 text-white animate-pulse-slow' 
                : 'bg-gradient-to-r from-nature-700 to-nature-800 text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Sparkles size={20} className="text-nature-100" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-white">{currentDate.getHours() >= 20 ? 'Ready for your Daily Review?' : 'Daily Review'}</h3>
                <p className="text-xs text-nature-200">Get AI suggestions for tomorrow</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-lg">✨</span>
            </div>
          </button>
        )}
      </div>

      {isAddingFood && (
        <AddFoodModal 
          mealCategory={isAddingFood as any} 
          date={dateStr}
          onClose={() => setIsAddingFood(null)} 
        />
      )}

      {isAddingExercise && (
        <AddExerciseModal 
          date={dateStr}
          onClose={() => setIsAddingExercise(false)} 
        />
      )}

      {showReport && (
        <MonthlyReport onClose={() => setShowReport(false)} />
      )}

      {showInsights && (
        <DailyInsightsModal 
          profile={profile}
          todaysLogs={todaysLogs}
          onClose={() => setShowInsights(false)} 
        />
      )}
    </div>
  );
}
