import React, { useState, useEffect } from 'react';
import { Heart, Droplets, Calendar, TrendingUp, Plus, Check, X, Settings } from 'lucide-react';
import Onboarding from './components/Onboarding';
import HabitTracker from './components/HabitTracker';
import MoodJournal from './components/MoodJournal';
import HydrationReminder from './components/HydrationReminder';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import { Habit, MoodEntry, HydrationSettings } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [hydrationSettings, setHydrationSettings] = useState<HydrationSettings>({
    interval: 60, // minutes
    enabled: false,
    dailyGoal: 8, // glasses
    currentCount: 0
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('wellness-onboarding-completed');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    const savedHabits = localStorage.getItem('wellness-habits');
    const savedMoods = localStorage.getItem('wellness-moods');
    const savedHydration = localStorage.getItem('wellness-hydration');

    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
    if (savedMoods) {
      setMoodEntries(JSON.parse(savedMoods));
    }
    if (savedHydration) {
      setHydrationSettings(JSON.parse(savedHydration));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('wellness-habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('wellness-moods', JSON.stringify(moodEntries));
  }, [moodEntries]);

  useEffect(() => {
    localStorage.setItem('wellness-hydration', JSON.stringify(hydrationSettings));
  }, [hydrationSettings]);

  const completeOnboarding = () => {
    localStorage.setItem('wellness-onboarding-completed', 'true');
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return <Onboarding onComplete={completeOnboarding} />;
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            habits={habits}
            moodEntries={moodEntries}
            hydrationSettings={hydrationSettings}
          />
        );
      case 'habits':
        return (
          <HabitTracker 
            habits={habits}
            setHabits={setHabits}
          />
        );
      case 'mood':
        return (
          <MoodJournal 
            moodEntries={moodEntries}
            setMoodEntries={setMoodEntries}
          />
        );
      case 'hydration':
        return (
          <HydrationReminder 
            settings={hydrationSettings}
            setSettings={setHydrationSettings}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WellnessTracker</h1>
                <p className="text-sm text-gray-500">Your daily wellness companion</p>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Desktop Sidebar Navigation */}
          <div className="hidden lg:block lg:col-span-3">
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            {renderActiveComponent()}
          </div>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200">
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {[
            { id: 'dashboard', icon: TrendingUp, label: 'Overview' },
            { id: 'habits', icon: Check, label: 'Habits' },
            { id: 'mood', icon: Heart, label: 'Mood' },
            { id: 'hydration', icon: Droplets, label: 'Water' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-3 rounded-lg flex flex-col items-center space-y-1 transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-green-100 text-green-600'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;