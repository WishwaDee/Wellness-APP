import React from 'react';
import { TrendingUp, Target, Droplets, Heart, Calendar, Award, Zap } from 'lucide-react';
import { Habit, MoodEntry, HydrationSettings } from '../types';
import MoodChart from './MoodChart';

interface DashboardProps {
  habits: Habit[];
  moodEntries: MoodEntry[];
  hydrationSettings: HydrationSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ habits, moodEntries, hydrationSettings }) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate today's habit completion
  const todayHabits = habits.filter(habit => 
    habit.frequency === 'daily' && habit.completedDates.includes(today)
  ).length;
  const totalDailyHabits = habits.filter(habit => habit.frequency === 'daily').length;
  const habitCompletionPercentage = totalDailyHabits > 0 ? Math.round((todayHabits / totalDailyHabits) * 100) : 0;

  // Get today's mood
  const todayMood = moodEntries.find(entry => entry.date.split('T')[0] === today);

  // Calculate streak
  const calculateStreak = () => {
    let streak = 0;
    let currentDate = new Date();
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dailyHabits = habits.filter(h => h.frequency === 'daily');
      const completedToday = dailyHabits.filter(h => h.completedDates.includes(dateStr)).length;
      
      if (completedToday === dailyHabits.length && dailyHabits.length > 0) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Get recent mood entries for chart
  const recentMoodEntries = moodEntries
    .slice(-7)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}! 👋</h2>
            <p className="text-green-100 mt-1">Let's make today amazing with healthy habits</p>
          </div>
          <div className="hidden sm:block">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Habit Completion */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-green-600">{habitCompletionPercentage}%</span>
          </div>
          <h3 className="font-semibold text-gray-900">Today's Progress</h3>
          <p className="text-sm text-gray-500">{todayHabits} of {totalDailyHabits} habits completed</p>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${habitCompletionPercentage}%` }}
            />
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-orange-600">{currentStreak}</span>
          </div>
          <h3 className="font-semibold text-gray-900">Current Streak</h3>
          <p className="text-sm text-gray-500">
            {currentStreak === 0 ? 'Start your streak today!' : `${currentStreak} day${currentStreak > 1 ? 's' : ''} strong!`}
          </p>
        </div>

        {/* Hydration */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Droplets className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-2xl font-bold text-blue-600">
              {hydrationSettings.currentCount}/{hydrationSettings.dailyGoal}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">Water Intake</h3>
          <p className="text-sm text-gray-500">
            {Math.round((hydrationSettings.currentCount / hydrationSettings.dailyGoal) * 100)}% of daily goal
          </p>
          <div className="mt-3 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((hydrationSettings.currentCount / hydrationSettings.dailyGoal) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Today's Mood */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-2xl">
              {todayMood ? todayMood.mood : '😊'}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900">Today's Mood</h3>
          <p className="text-sm text-gray-500">
            {todayMood ? todayMood.moodLabel : 'Log your mood today'}
          </p>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Mood Trends</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          {recentMoodEntries.length > 0 ? (
            <MoodChart entries={recentMoodEntries} />
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Start logging your moods to see trends</p>
            </div>
          )}
        </div>

        {/* Recent Habits */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Today's Habits</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          
          {habits.filter(h => h.frequency === 'daily').length > 0 ? (
            <div className="space-y-3">
              {habits.filter(h => h.frequency === 'daily').slice(0, 5).map(habit => (
                <div key={habit.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                      style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                    >
                      {habit.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{habit.name}</p>
                      <p className="text-xs text-gray-500">{habit.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    {habit.completedDates.includes(today) ? (
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Add some habits to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;