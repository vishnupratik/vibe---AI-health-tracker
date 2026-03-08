import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { UserProfile, MealLogEntry } from '../types';
import Markdown from 'react-markdown';

interface DailyInsightsModalProps {
  profile: UserProfile;
  todaysLogs: MealLogEntry[];
  onClose: () => void;
}

export function DailyInsightsModal({ profile, todaysLogs, onClose }: DailyInsightsModalProps) {
  const [insights, setInsights] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      if (todaysLogs.length === 0) {
        setInsights("You haven't logged any food today yet! Log some meals to get personalized insights and healthier alternatives.");
        setLoading(false);
        return;
      }

      try {
        const apiKey = (process as any).env.GEMINI_API_KEY;
        const ai = new GoogleGenAI({ apiKey });
        
        const prompt = `You are Vibe, a friendly AI wellness companion.
User: ${profile.name}
Goal: ${profile.primaryGoal.replace('_', ' ')}
Diet: ${profile.dietaryPreference.replace('_', ' ')}

Today's food log:
${todaysLogs.map(l => `- ${l.mealCategory}: ${l.foodName} (${l.quantity} ${l.unit}) - ${Math.round(l.nutrition.calories)} kcal`).join('\n')}

Based on this food log, provide 2-3 short, actionable, and friendly suggestions for healthier alternatives or changes they could make tomorrow to better align with their goals. Keep it encouraging and concise. Use markdown formatting. Do not use any generic greetings, just provide the insights directly.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt,
        });

        setInsights(response.text || "I couldn't generate insights at the moment. Please try again later.");
      } catch (err) {
        console.error("Error fetching insights:", err);
        setError("Failed to generate insights. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, [profile, todaysLogs]);

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
          className="bg-sand-100 rounded-t-[2rem] max-h-[90vh] flex flex-col overflow-hidden"
        >
          <div className="p-6 pb-4 flex justify-between items-center border-b border-nature-200/50 bg-white">
            <div>
              <p className="text-nature-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">Vibe AI</p>
              <h2 className="text-xl font-serif font-semibold text-nature-900">Daily Review</h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-nature-200/50 text-nature-700 transition">
              <X size={20} />
            </button>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 text-nature-500">
                <Loader2 size={32} className="animate-spin mb-4 text-nature-600" />
                <p>Analyzing your day...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                {error}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-nature-100">
                <div className="flex items-center gap-3 mb-4 text-nature-800">
                  <div className="w-10 h-10 rounded-full bg-nature-100 flex items-center justify-center">
                    <Sparkles size={20} className="text-nature-600" />
                  </div>
                  <h3 className="font-medium">Suggestions for Tomorrow</h3>
                </div>
                <div className="prose prose-sm prose-emerald max-w-none">
                  <Markdown>{insights}</Markdown>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
