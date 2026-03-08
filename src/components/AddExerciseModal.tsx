import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store';
import { ExerciseLogEntry } from '../types';
import { X, Activity } from 'lucide-react';
import { Button } from './ui/Button';

const EXERCISE_DB = [
  { id: 'walking', name: 'Walking', met: 3.5 },
  { id: 'running', name: 'Running', met: 8.0 },
  { id: 'cycling', name: 'Cycling', met: 6.0 },
  { id: 'swimming', name: 'Swimming', met: 6.0 },
  { id: 'yoga', name: 'Yoga', met: 2.5 },
  { id: 'weightlifting', name: 'Weightlifting', met: 3.0 },
  { id: 'hiit', name: 'HIIT', met: 8.0 },
];

interface AddExerciseModalProps {
  date: string;
  onClose: () => void;
}

export function AddExerciseModal({ date, onClose }: AddExerciseModalProps) {
  const { profile, addExerciseLog } = useAppStore();
  const [selectedExercise, setSelectedExercise] = useState(EXERCISE_DB[0]);
  const [duration, setDuration] = useState(30);

  const calculateCalories = () => {
    if (!profile) return 0;
    // Calories = MET * weight(kg) * duration(hrs)
    return selectedExercise.met * profile.weight * (duration / 60);
  };

  const handleSave = () => {
    const log: ExerciseLogEntry = {
      id: Math.random().toString(36).substring(7),
      date,
      timestamp: Date.now(),
      exerciseName: selectedExercise.name,
      durationMinutes: duration,
      caloriesBurned: calculateCalories(),
    };
    addExerciseLog(log);
    onClose();
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
          className="bg-sand-100 rounded-t-[2rem] h-[70vh] flex flex-col overflow-hidden"
        >
          <div className="p-6 pb-4 flex justify-between items-center border-b border-nature-200/50">
            <h2 className="text-xl font-serif font-semibold text-nature-900">Add Exercise</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-nature-200/50 text-nature-700 transition">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto flex flex-col">
            <div className="space-y-4 mb-8">
              <label className="block text-sm font-medium text-nature-800">Activity Type</label>
              <div className="grid grid-cols-2 gap-2">
                {EXERCISE_DB.map(ex => (
                  <button 
                    key={ex.id}
                    onClick={() => setSelectedExercise(ex)}
                    className={`p-3 rounded-xl border text-sm transition-colors flex items-center gap-2 ${selectedExercise.id === ex.id ? 'bg-nature-800 text-white border-nature-800' : 'border-nature-200 text-nature-700 hover:bg-nature-50'}`}
                  >
                    <Activity size={16} />
                    {ex.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <label className="block text-sm font-medium text-nature-800">Duration (minutes)</label>
              <input 
                type="number" 
                min="1" 
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
                className="w-full p-4 rounded-2xl border border-nature-200 focus:ring-2 focus:ring-nature-400 outline-none text-lg"
              />
            </div>

            <div className="mt-auto bg-white p-6 rounded-3xl border border-nature-200 shadow-sm mb-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-nature-500">Estimated Burn</p>
                <p className="text-3xl font-serif font-semibold text-nature-900">{Math.round(calculateCalories())} <span className="text-lg font-normal text-nature-500">kcal</span></p>
              </div>
              <div className="w-12 h-12 rounded-full bg-earth-100 text-earth-700 flex items-center justify-center">
                <Activity size={24} />
              </div>
            </div>

            <Button className="w-full" onClick={handleSave}>Log Exercise</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
