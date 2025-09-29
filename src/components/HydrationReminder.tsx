import React, { useState, useEffect } from 'react';
import { Droplets, Plus, Minus, Bell, BellOff, Target, Award } from 'lucide-react';
import { HydrationSettings } from '../types';

interface HydrationReminderProps {
  settings: HydrationSettings;
  setSettings: (settings: HydrationSettings) => void;
}

const HydrationReminder: React.FC<HydrationReminderProps> = ({ settings, setSettings }) => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [lastNotificationTime, setLastNotificationTime] = useState<number>(0);

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    // Reset daily count at midnight
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (settings.lastReset !== today) {
      setSettings({
        ...settings,
        currentCount: 0,
        lastReset: today
      });
    }
  }, [settings, setSettings]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (settings.enabled && notificationPermission === 'granted') {
      intervalId = setInterval(() => {
        const now = Date.now();
        if (now - lastNotificationTime >= settings.interval * 60 * 1000) {
          showNotification();
          setLastNotificationTime(now);
        }
      }, 60 * 1000); // Check every minute
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [settings.enabled, settings.interval, notificationPermission, lastNotificationTime]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === 'granted';
    }
    return false;
  };

  const showNotification = () => {
    if (notificationPermission === 'granted') {
      new Notification('💧 Hydration Reminder', {
        body: `Time to drink some water! You've had ${settings.currentCount} of ${settings.dailyGoal} glasses today.`,
        icon: '/water-icon.png',
        badge: '/water-icon.png'
      });
    }
  };

  const toggleReminders = async () => {
    if (!settings.enabled) {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        setSettings({ ...settings, enabled: true });
        setLastNotificationTime(Date.now());
      }
    } else {
      setSettings({ ...settings, enabled: false });
    }
  };

  const addWater = () => {
    setSettings({
      ...settings,
      currentCount: Math.min(settings.currentCount + 1, settings.dailyGoal * 2)
    });
  };

  const removeWater = () => {
    setSettings({
      ...settings,
      currentCount: Math.max(settings.currentCount - 1, 0)
    });
  };

  const updateDailyGoal = (goal: number) => {
    setSettings({ ...settings, dailyGoal: Math.max(1, goal) });
  };

  const updateInterval = (interval: number) => {
    setSettings({ ...settings, interval: Math.max(15, Math.min(480, interval)) });
  };

  const getProgressPercentage = () => {
    return Math.min((settings.currentCount / settings.dailyGoal) * 100, 100);
  };

  const getMotivationMessage = () => {
    const percentage = getProgressPercentage();
    if (percentage >= 100) return "🎉 Goal achieved! Amazing job!";
    if (percentage >= 75) return "💪 Almost there! Keep it up!";
    if (percentage >= 50) return "🚀 Great progress! Halfway done!";
    if (percentage >= 25) return "👏 Good start! Keep going!";
    return "💧 Let's start hydrating!";
  };

  const getStreakDays = () => {
    // This would typically be calculated from historical data
    // For now, return a simple calculation
    return settings.currentCount >= settings.dailyGoal ? 1 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Droplets className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Hydration Tracker</h2>
        <p className="text-gray-600">Stay hydrated throughout the day</p>
      </div>

      {/* Current Progress */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="relative w-32 h-32 mx-auto mb-6">
          {/* Progress Circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="2"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeDasharray={`${getProgressPercentage()}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{settings.currentCount}</div>
              <div className="text-xs text-gray-500">of {settings.dailyGoal}</div>
            </div>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{getMotivationMessage()}</h3>
        <p className="text-sm text-gray-500 mb-6">
          {Math.round(getProgressPercentage())}% of daily goal completed
        </p>

        {/* Water Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={removeWater}
            disabled={settings.currentCount === 0}
            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="text-center">
            <div className="text-4xl mb-1">💧</div>
            <div className="text-xs text-gray-500">Add Glass</div>
          </div>
          
          <button
            onClick={addWater}
            className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors text-white"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{settings.dailyGoal}</div>
          <div className="text-sm text-gray-500">Daily Goal</div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
          <Award className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900">{getStreakDays()}</div>
          <div className="text-sm text-gray-500">Day Streak</div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Hydration Settings</h3>
        
        <div className="space-y-6">
          {/* Reminder Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {settings.enabled ? (
                <Bell className="w-5 h-5 text-blue-500" />
              ) : (
                <BellOff className="w-5 h-5 text-gray-400" />
              )}
              <div>
                <p className="font-medium text-gray-900">Reminders</p>
                <p className="text-sm text-gray-500">Get notified to drink water</p>
              </div>
            </div>
            <button
              onClick={toggleReminders}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.enabled ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reminder Interval */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reminder Interval (minutes)
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateInterval(settings.interval - 15)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-medium text-gray-900 min-w-[3rem] text-center">
                {settings.interval}
              </span>
              <button
                onClick={() => updateInterval(settings.interval + 15)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Range: 15-480 minutes</p>
          </div>

          {/* Daily Goal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Goal (glasses)
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => updateDailyGoal(settings.dailyGoal - 1)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-medium text-gray-900 min-w-[2rem] text-center">
                {settings.dailyGoal}
              </span>
              <button
                onClick={() => updateDailyGoal(settings.dailyGoal + 1)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Permission Info */}
      {notificationPermission !== 'granted' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Enable notifications to receive hydration reminders
              </p>
              <button
                onClick={requestNotificationPermission}
                className="text-sm text-yellow-700 hover:text-yellow-800 underline mt-1"
              >
                Enable notifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HydrationReminder;