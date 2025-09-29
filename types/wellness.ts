export interface MoodEntry {
  id: string;
  date: string;
  emoji: string;
  mood: string;
  note?: string;
  timestamp: number;
}

export interface HydrationEntry {
  id: string;
  date: string;
  amount: number;
  timestamp: number;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  target: number;
  unit: string;
  createdAt: number;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  value: number;
  timestamp: number;
}

export interface WellnessData {
  moods: MoodEntry[];
  hydration: HydrationEntry[];
  habits: Habit[];
  habitEntries: HabitEntry[];
}