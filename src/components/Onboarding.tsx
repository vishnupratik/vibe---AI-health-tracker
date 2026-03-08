import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { ActivityLevel, DietaryPreference, PrimaryGoal, EatingPattern, UserProfile } from '../types';
import { Leaf } from 'lucide-react';

export function Onboarding() {
  const { setProfile } = useAppStore();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<UserProfile>>({
    gender: 'other',
    activityLevel: 'sedentary',
    dietaryPreference: 'mixed' as any,
    primaryGoal: 'maintain_weight',
    eatingPattern: 'mixed',
    exerciseReminderTime: '17:00',
  });

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const calculateTarget = () => {
    const { weight = 70, height = 170, age = 30, gender, activityLevel, primaryGoal } = data;
    
    // Mifflin-St Jeor
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += gender === 'male' ? 5 : -161;

    const activityMultipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      lightly_active: 1.375,
      active: 1.55,
      athlete: 1.725
    };
    let tdee = bmr * (activityMultipliers[activityLevel as ActivityLevel] || 1.2);

    const goalAdjustments: Record<PrimaryGoal, number> = {
      weight_loss: -500,
      maintain_weight: 0,
      muscle_gain: 300,
      general_health: 0
    };
    tdee += goalAdjustments[primaryGoal as PrimaryGoal] || 0;

    return Math.round(tdee);
  };

  const handleComplete = () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    const target = calculateTarget();
    const waterTarget = (data.weight || 70) * 35; // 35ml per kg of body weight
    setProfile({
      ...data,
      dailyCalorieTarget: target,
      dailyWaterTarget: waterTarget,
    } as UserProfile);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-nature-900 via-nature-800 to-nature-700">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-nature-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-earth-500/20 rounded-full blur-3xl" />

      <Card className="w-full max-w-md relative z-10 bg-white/95 backdrop-blur shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-nature-100 rounded-full flex items-center justify-center text-nature-700">
            <Leaf size={24} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="text-center mb-6">
                <h1 className="text-4xl font-serif font-bold text-nature-900 tracking-tight mb-2">Vibe</h1>
                <p className="text-nature-600 text-sm">Your AI wellness companion.</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-nature-800 mb-1">What should we call you?</label>
                  <input type="text" className="w-full p-3 rounded-xl border border-nature-200 focus:ring-2 focus:ring-nature-400 outline-none" 
                    value={data.name || ''} onChange={e => setData({...data, name: e.target.value})} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-nature-800 mb-1">Age</label>
                  <input type="number" className="w-full p-3 rounded-xl border border-nature-200 focus:ring-2 focus:ring-nature-400 outline-none" 
                    value={data.age || ''} onChange={e => setData({...data, age: Number(e.target.value)})} placeholder="e.g. 25" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-nature-800 mb-1">Height (cm)</label>
                    <input type="number" className="w-full p-3 rounded-xl border border-nature-200 focus:ring-2 focus:ring-nature-400 outline-none" 
                      value={data.height || ''} onChange={e => setData({...data, height: Number(e.target.value)})} placeholder="170" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nature-800 mb-1">Weight (kg)</label>
                    <input type="number" className="w-full p-3 rounded-xl border border-nature-200 focus:ring-2 focus:ring-nature-400 outline-none" 
                      value={data.weight || ''} onChange={e => setData({...data, weight: Number(e.target.value)})} placeholder="70" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-nature-800 mb-1">Gender</label>
                  <select className="w-full p-3 rounded-xl border border-nature-200 focus:ring-2 focus:ring-nature-400 outline-none bg-white"
                    value={data.gender} onChange={e => setData({...data, gender: e.target.value as any})}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <Button className="w-full mt-8" onClick={handleNext} disabled={!data.name || !data.age || !data.height || !data.weight}>Continue</Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-serif font-semibold text-center mb-6 text-nature-900">Your Lifestyle</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-nature-800 mb-2">Activity Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['sedentary', 'lightly_active', 'active', 'athlete'] as const).map(level => (
                      <button key={level} 
                        className={`p-3 rounded-xl border text-sm transition-colors ${data.activityLevel === level ? 'bg-nature-800 text-white border-nature-800' : 'border-nature-200 text-nature-700 hover:bg-nature-50'}`}
                        onClick={() => setData({...data, activityLevel: level})}>
                        {level.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-nature-800 mb-2">Primary Goal</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['weight_loss', 'maintain_weight', 'muscle_gain', 'general_health'] as const).map(goal => (
                      <button key={goal} 
                        className={`p-3 rounded-xl border text-sm transition-colors ${data.primaryGoal === goal ? 'bg-nature-800 text-white border-nature-800' : 'border-nature-200 text-nature-700 hover:bg-nature-50'}`}
                        onClick={() => setData({...data, primaryGoal: goal})}>
                        {goal.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <Button variant="ghost" onClick={handleBack}>Back</Button>
                <Button className="flex-1" onClick={handleNext}>Continue</Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-serif font-semibold text-center mb-6 text-nature-900">Dietary Preferences</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-nature-800 mb-2">Diet Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['vegetarian', 'eggetarian', 'non_vegetarian', 'vegan'] as const).map(diet => (
                      <button key={diet} 
                        className={`p-3 rounded-xl border text-sm transition-colors ${data.dietaryPreference === diet ? 'bg-nature-800 text-white border-nature-800' : 'border-nature-200 text-nature-700 hover:bg-nature-50'}`}
                        onClick={() => setData({...data, dietaryPreference: diet})}>
                        {diet.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-nature-800 mb-2">Eating Pattern</label>
                  <div className="grid grid-cols-1 gap-2">
                    {(['home_cooked', 'mixed', 'outside_food'] as const).map(pattern => (
                      <button key={pattern} 
                        className={`p-3 rounded-xl border text-sm transition-colors ${data.eatingPattern === pattern ? 'bg-nature-800 text-white border-nature-800' : 'border-nature-200 text-nature-700 hover:bg-nature-50'}`}
                        onClick={() => setData({...data, eatingPattern: pattern})}>
                        {pattern.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <Button variant="ghost" onClick={handleBack}>Back</Button>
                <Button className="flex-1" onClick={handleNext}>Continue</Button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-2xl font-serif font-semibold text-center mb-6 text-nature-900">Daily Reminders</h2>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h3 className="font-medium text-blue-900 mb-1">Water Goal</h3>
                  <p className="text-sm text-blue-700">Based on your weight, your daily water goal is <strong>{Math.round(((data.weight || 70) * 35) / 100) * 100}ml</strong>. We'll remind you to drink water every hour.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-nature-800 mb-2">When do you prefer to exercise?</label>
                  <p className="text-xs text-nature-500 mb-3">Set a time to receive a daily reminder.</p>
                  <input 
                    type="time" 
                    className="w-full p-4 rounded-xl border border-nature-200 focus:ring-2 focus:ring-nature-400 outline-none text-lg bg-white"
                    value={data.exerciseReminderTime || '17:00'} 
                    onChange={e => setData({...data, exerciseReminderTime: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <Button variant="ghost" onClick={handleBack}>Back</Button>
                <Button className="flex-1" onClick={handleComplete}>Complete</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
