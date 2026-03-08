import { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';
import { Card } from './ui/Card';
import { X, Award, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format, subDays, isSameDay } from 'date-fns';

interface MonthlyReportProps {
  onClose: () => void;
}

export function MonthlyReport({ onClose }: MonthlyReportProps) {
  const { profile, logs } = useAppStore();

  const analysis = useMemo(() => {
    if (!profile) return null;

    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => subDays(today, i));
    
    let totalCalories = 0;
    let daysTracked = 0;
    let daysOverLimit = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    last30Days.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayLogs = logs.filter(l => l.date === dateStr);
      
      if (dayLogs.length > 0) {
        daysTracked++;
        const dayCals = dayLogs.reduce((sum, l) => sum + l.nutrition.calories, 0);
        totalCalories += dayCals;
        totalProtein += dayLogs.reduce((sum, l) => sum + l.nutrition.protein, 0);
        totalCarbs += dayLogs.reduce((sum, l) => sum + l.nutrition.carbs, 0);
        totalFat += dayLogs.reduce((sum, l) => sum + l.nutrition.fat, 0);
        
        if (dayCals > profile.dailyCalorieTarget) {
          daysOverLimit++;
        }
      }
    });

    if (daysTracked === 0) return { score: 0, insights: ['Not enough data yet. Keep tracking!'], daysTracked: 0, avgCalories: 0 };

    const avgCalories = totalCalories / daysTracked;
    const avgProtein = totalProtein / daysTracked;
    
    let score = 100;
    const insights: string[] = [];

    // Consistency check
    if (daysTracked < 15) {
      score -= 20;
      insights.push(`Try to track more consistently for better insights, ${profile.name}.`);
    } else {
      insights.push(`Great job tracking consistently, ${profile.name}!`);
    }

    // Calorie limit check
    if (daysOverLimit > 5) {
      score -= (daysOverLimit - 5) * 2;
      insights.push(`You exceeded your calorie target on ${daysOverLimit} days.`);
    }

    // Protein check (rough estimate: 0.8g per kg of body weight)
    const targetProtein = profile.weight * 0.8;
    if (avgProtein < targetProtein) {
      score -= 10;
      insights.push(`Your average protein intake (${Math.round(avgProtein)}g) is a bit low.`);
    } else {
      insights.push('Excellent protein intake!');
    }

    return {
      score: Math.max(0, Math.min(100, Math.round(score))),
      insights,
      daysTracked,
      avgCalories: Math.round(avgCalories),
    };
  }, [profile, logs]);

  if (!analysis) return null;

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
          className="bg-sand-100 rounded-t-[2rem] h-[90vh] flex flex-col overflow-hidden"
        >
          <div className="p-6 pb-4 flex justify-between items-center border-b border-nature-200/50 bg-white">
            <div>
              <p className="text-nature-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Vibe Analysis</p>
              <h2 className="text-xl font-serif font-semibold text-nature-900">{profile.name}'s Monthly Report</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-nature-200/50 text-nature-700 transition">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            <Card className="bg-gradient-to-br from-nature-800 to-nature-900 text-white border-none relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-nature-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-nature-300 text-sm mb-1">Healthiness Score</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-serif font-bold">{analysis.score}</span>
                    <span className="text-nature-400">/ 100</span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                  <Award size={32} className={analysis.score > 80 ? 'text-yellow-400' : analysis.score > 60 ? 'text-nature-300' : 'text-earth-300'} />
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-full bg-nature-100 text-nature-700 flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
                <span className="text-sm text-nature-500">Avg Calories</span>
                <span className="text-xl font-semibold text-nature-900">{analysis.avgCalories} <span className="text-xs font-normal">kcal</span></span>
              </Card>
              <Card className="p-4 flex flex-col gap-2">
                <div className="w-8 h-8 rounded-full bg-earth-100 text-earth-700 flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
                <span className="text-sm text-nature-500">Days Tracked</span>
                <span className="text-xl font-semibold text-nature-900">{analysis.daysTracked} <span className="text-xs font-normal">/ 30</span></span>
              </Card>
            </div>

            <div>
              <h3 className="text-lg font-serif font-medium text-nature-900 mb-4">AI Analysis</h3>
              <div className="space-y-3">
                {analysis.insights.map((insight, i) => (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-nature-100 flex gap-3 items-start shadow-sm">
                    <div className="mt-0.5">
                      {insight.includes('low') || insight.includes('exceeded') || insight.includes('Try') ? (
                        <AlertCircle size={18} className="text-earth-500" />
                      ) : (
                        <CheckCircle2 size={18} className="text-nature-500" />
                      )}
                    </div>
                    <p className="text-sm text-nature-800 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center pt-4 pb-8">
              <p className="text-xs text-nature-400 max-w-xs mx-auto">
                Nutrition values and AI-based estimates are approximate and intended for personal tracking and educational purposes only, not medical advice.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
