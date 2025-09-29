import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WellnessData, MoodEntry, HydrationEntry, Habit, HabitEntry } from '@/types/wellness';

const STORAGE_KEY = 'wellness_data';

const defaultData: WellnessData = {
  moods: [],
  hydration: [],
  habits: [
    {
      id: '1',
      name: 'Exercise',
      icon: '🏃‍♂️',
      color: '#FF6B6B',
      target: 30,
      unit: 'minutes',
      createdAt: Date.now(),
    },
    {
      id: '2',
      name: 'Meditation',
      icon: '🧘‍♀️',
      color: '#4ECDC4',
      target: 10,
      unit: 'minutes',
      createdAt: Date.now(),
    },
    {
      id: '3',
      name: 'Reading',
      icon: '📚',
      color: '#45B7D1',
      target: 20,
      unit: 'minutes',
      createdAt: Date.now(),
    },
    {
      id: '4',
      name: 'Sleep',
      icon: '😴',
      color: '#96CEB4',
      target: 8,
      unit: 'hours',
      createdAt: Date.now(),
    },
  ],
  habitEntries: [],
};

export function useWellnessData() {
  const [data, setData] = useState<WellnessData>(defaultData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        setData({ ...defaultData, ...parsedData });
      }
    } catch (error) {
      console.error('Error loading wellness data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (newData: WellnessData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error saving wellness data:', error);
    }
  };

  const addMoodEntry = (mood: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: MoodEntry = {
      ...mood,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    const newData = {
      ...data,
      moods: [newEntry, ...data.moods],
    };
    saveData(newData);
  };

  const addHydrationEntry = (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = data.hydration.find(entry => entry.date === today);
    
    let newData;
    if (existingEntry) {
      newData = {
        ...data,
        hydration: data.hydration.map(entry =>
          entry.id === existingEntry.id
            ? { ...entry, amount: entry.amount + amount, timestamp: Date.now() }
            : entry
        ),
      };
    } else {
      const newEntry: HydrationEntry = {
        id: Date.now().toString(),
        date: today,
        amount,
        timestamp: Date.now(),
      };
      newData = {
        ...data,
        hydration: [newEntry, ...data.hydration],
      };
    }
    saveData(newData);
  };

  const updateHabitEntry = (habitId: string, value: number) => {
    const today = new Date().toISOString().split('T')[0];
    const existingEntry = data.habitEntries.find(
      entry => entry.habitId === habitId && entry.date === today
    );

    let newData;
    if (existingEntry) {
      newData = {
        ...data,
        habitEntries: data.habitEntries.map(entry =>
          entry.id === existingEntry.id
            ? { ...entry, value, completed: value > 0, timestamp: Date.now() }
            : entry
        ),
      };
    } else {
      const newEntry: HabitEntry = {
        id: Date.now().toString(),
        habitId,
        date: today,
        completed: value > 0,
        value,
        timestamp: Date.now(),
      };
      newData = {
        ...data,
        habitEntries: [newEntry, ...data.habitEntries],
      };
    }
    saveData(newData);
  };

  const getTodayHydration = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = data.hydration.find(entry => entry.date === today);
    return todayEntry?.amount || 0;
  };

  const getTodayHabitEntries = () => {
    const today = new Date().toISOString().split('T')[0];
    return data.habitEntries.filter(entry => entry.date === today);
  };

  const getTodayMood = () => {
    const today = new Date().toISOString().split('T')[0];
    return data.moods.find(entry => entry.date === today);
  };

  return {
    data,
    loading,
    addMoodEntry,
    addHydrationEntry,
    updateHabitEntry,
    getTodayHydration,
    getTodayHabitEntries,
    getTodayMood,
  };
}