import { useEffect, useRef } from 'react';
import { useAppStore } from '../store';

export function useNotifications() {
  const { profile } = useAppStore();
  const waterIntervalRef = useRef<number | null>(null);
  const exerciseIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!profile) return;

    // Request permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    const sendNotification = (title: string, options?: NotificationOptions) => {
      if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(title, options);
      }
    };

    // Water Reminder: Every hour
    if (waterIntervalRef.current) clearInterval(waterIntervalRef.current);
    waterIntervalRef.current = window.setInterval(() => {
      sendNotification(`Time to hydrate, ${profile.name}! 💧`, {
        body: 'Drink a glass of water to reach your daily goal.',
        icon: '/favicon.ico' // Assuming a default icon
      });
    }, 60 * 60 * 1000); // 1 hour

    // Exercise Reminder: Check every 10 seconds
    let lastExerciseNotificationDate: string | null = null;
    let lastReviewNotificationDate: string | null = null;
    
    if (exerciseIntervalRef.current) clearInterval(exerciseIntervalRef.current);
    exerciseIntervalRef.current = window.setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const currentDateStr = now.toDateString();

      // Exercise Reminder
      if (profile.exerciseReminderTime && currentTimeStr === profile.exerciseReminderTime && lastExerciseNotificationDate !== currentDateStr) {
        sendNotification(`Time to move, ${profile.name}! ⚡`, {
          body: 'It is your scheduled time to exercise. Let\'s get some activity in!',
          icon: '/favicon.ico'
        });
        lastExerciseNotificationDate = currentDateStr;
      }

      // Daily Review Reminder at 20:00 (8 PM)
      if (currentTimeStr === '20:00' && lastReviewNotificationDate !== currentDateStr) {
        sendNotification(`Daily Review is ready, ${profile.name}! ✨`, {
          body: 'Check your Vibe dashboard for AI suggestions and healthier alternatives for tomorrow.',
          icon: '/favicon.ico'
        });
        lastReviewNotificationDate = currentDateStr;
      }
    }, 10 * 1000); // 10 seconds

    return () => {
      if (waterIntervalRef.current) clearInterval(waterIntervalRef.current);
      if (exerciseIntervalRef.current) clearInterval(exerciseIntervalRef.current);
    };
  }, [profile]);
}
