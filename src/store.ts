import { useState, useEffect } from 'react';
import { UserProfile, MealLogEntry, ExerciseLogEntry, WaterLogEntry, GamificationState, Badge } from './types';
import { differenceInDays, parseISO } from 'date-fns';

export function useAppStore() {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('vibe_profile');
    return saved ? JSON.parse(saved) : null;
  });

  const [logs, setLogs] = useState<MealLogEntry[]>(() => {
    const saved = localStorage.getItem('vibe_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLogEntry[]>(() => {
    const saved = localStorage.getItem('vibe_exercise_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [waterLogs, setWaterLogs] = useState<WaterLogEntry[]>(() => {
    const saved = localStorage.getItem('vibe_water_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [gamification, setGamification] = useState<GamificationState>(() => {
    const saved = localStorage.getItem('vibe_gamification');
    return saved ? JSON.parse(saved) : {
      points: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastLogDate: null,
      badges: []
    };
  });

  useEffect(() => {
    if (profile) localStorage.setItem('vibe_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('vibe_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('vibe_exercise_logs', JSON.stringify(exerciseLogs));
  }, [exerciseLogs]);

  useEffect(() => {
    localStorage.setItem('vibe_water_logs', JSON.stringify(waterLogs));
  }, [waterLogs]);

  useEffect(() => {
    localStorage.setItem('vibe_gamification', JSON.stringify(gamification));
  }, [gamification]);

  const awardBadge = (badgeId: string, name: string, description: string, icon: string) => {
    setGamification(prev => {
      if (prev.badges.some(b => b.id === badgeId)) return prev;
      return {
        ...prev,
        badges: [...prev.badges, { id: badgeId, name, description, icon, dateEarned: new Date().toISOString() }]
      };
    });
  };

  const updateStreakAndPoints = (dateStr: string, pointsToAdd: number) => {
    setGamification(prev => {
      let newStreak = prev.currentStreak;
      let newLastLogDate = prev.lastLogDate;
      
      if (!prev.lastLogDate) {
        newStreak = 1;
        newLastLogDate = dateStr;
      } else if (prev.lastLogDate !== dateStr) {
        const diff = differenceInDays(parseISO(dateStr), parseISO(prev.lastLogDate));
        if (diff === 1) {
          newStreak += 1;
        } else if (diff > 1) {
          newStreak = 1;
        }
        newLastLogDate = dateStr;
      }

      const newLongest = Math.max(prev.longestStreak, newStreak);

      return {
        ...prev,
        points: prev.points + pointsToAdd,
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastLogDate: newLastLogDate
      };
    });
  };

  const addLog = (log: MealLogEntry) => {
    setLogs(prev => [...prev, log]);
    updateStreakAndPoints(log.date, 10);
  };
  const removeLog = (id: string) => setLogs(prev => prev.filter(l => l.id !== id));

  const addExerciseLog = (log: ExerciseLogEntry) => {
    setExerciseLogs(prev => [...prev, log]);
    updateStreakAndPoints(log.date, 15);
  };
  const removeExerciseLog = (id: string) => setExerciseLogs(prev => prev.filter(l => l.id !== id));

  const addWaterLog = (log: WaterLogEntry) => {
    setWaterLogs(prev => [...prev, log]);
    updateStreakAndPoints(log.date, 5);
  };
  const removeWaterLog = (id: string) => setWaterLogs(prev => prev.filter(l => l.id !== id));

  return { 
    profile, setProfile, 
    logs, addLog, removeLog,
    exerciseLogs, addExerciseLog, removeExerciseLog,
    waterLogs, addWaterLog, removeWaterLog,
    gamification, awardBadge
  };
}
