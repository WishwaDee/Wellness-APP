export interface Habit {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  targetCount: number;
  completedDates: string[]; // ISO date strings
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  mood: string; // emoji
  moodLabel: string;
  note: string;
  date: string; // ISO date string
  rating: number; // 1-5 scale
}

export interface HydrationSettings {
  interval: number; // minutes
  enabled: boolean;
  dailyGoal: number; // glasses
  currentCount: number;
  lastReset?: string; // ISO date string
}

export interface DailyProgress {
  date: string;
  completedHabits: number;
  totalHabits: number;
  moodRating?: number;
  hydrationCount: number;
}