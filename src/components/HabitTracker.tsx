import React, { useState } from 'react';
import { Plus, CreditCard as Edit3, Trash2, Check, Target, Zap, Coffee, Book, Dumbbell, Leaf } from 'lucide-react';
import { Habit } from '../types';

interface HabitTrackerProps {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, setHabits }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    icon: '⭐',
    color: '#10B981',
    frequency: 'daily' as 'daily' | 'weekly',
    targetCount: 1
  });

  const today = new Date().toISOString().split('T')[0];

  const habitIcons = ['⭐', '💪', '📚', '🧘', '💧', '🏃', '🍎', '😴', '📱', '🎯'];
  const habitColors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16', '#F97316'];

  const addHabit = () => {
    if (newHabit.name.trim()) {
      const habit: Habit = {
        id: Date.now().toString(),
        name: newHabit.name,
        description: newHabit.description,
        icon: newHabit.icon,
        color: newHabit.color,
        frequency: newHabit.frequency,
        targetCount: newHabit.targetCount,
        completedDates: [],
        createdAt: new Date().toISOString()
      };
      setHabits([...habits, habit]);
      setNewHabit({ name: '', description: '', icon: '⭐', color: '#10B981', frequency: 'daily', targetCount: 1 });
      setShowAddForm(false);
    }
  };

  const updateHabit = () => {
    if (editingHabit && newHabit.name.trim()) {
      const updatedHabits = habits.map(habit =>
        habit.id === editingHabit.id
          ? { ...habit, ...newHabit }
          : habit
      );
      setHabits(updatedHabits);
      setEditingHabit(null);
      setNewHabit({ name: '', description: '', icon: '⭐', color: '#10B981', frequency: 'daily', targetCount: 1 });
    }
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const toggleHabitCompletion = (habitId: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const completedDates = habit.completedDates.includes(today)
          ? habit.completedDates.filter(date => date !== today)
          : [...habit.completedDates, today];
        return { ...habit, completedDates };
      }
      return habit;
    });
    setHabits(updatedHabits);
  };

  const startEditing = (habit: Habit) => {
    setEditingHabit(habit);
    setNewHabit({
      name: habit.name,
      description: habit.description,
      icon: habit.icon,
      color: habit.color,
      frequency: habit.frequency,
      targetCount: habit.targetCount
    });
    setShowAddForm(true);
  };

  const cancelEditing = () => {
    setEditingHabit(null);
    setNewHabit({ name: '', description: '', icon: '⭐', color: '#10B981', frequency: 'daily', targetCount: 1 });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Habit Tracker</h2>
          <p className="text-gray-600">Build lasting habits, one day at a time</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Habit</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingHabit ? 'Edit Habit' : 'Create New Habit'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Habit Name</label>
              <input
                type="text"
                value={newHabit.name}
                onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Drink 8 glasses of water"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={newHabit.description}
                onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Optional description"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
              <div className="grid grid-cols-5 gap-2">
                {habitIcons.map(icon => (
                  <button
                    key={icon}
                    onClick={() => setNewHabit({ ...newHabit, icon })}
                    className={`w-10 h-10 rounded-lg border-2 transition-colors ${
                      newHabit.icon === icon
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-lg">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="grid grid-cols-4 gap-2">
                {habitColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setNewHabit({ ...newHabit, color })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      newHabit.color === color
                        ? 'border-gray-400 scale-110'
                        : 'border-gray-200 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
              <select
                value={newHabit.frequency}
                onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value as 'daily' | 'weekly' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={cancelEditing}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingHabit ? updateHabit : addHabit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {editingHabit ? 'Update Habit' : 'Add Habit'}
            </button>
          </div>
        </div>
      )}

      {/* Habits List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map(habit => {
          const isCompleted = habit.completedDates.includes(today);
          const completionRate = habit.completedDates.length;
          
          return (
            <div key={habit.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-lg"
                    style={{ backgroundColor: `${habit.color}20`, color: habit.color }}
                  >
                    {habit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{habit.name}</h3>
                    <p className="text-sm text-gray-500">{habit.description}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-400">{habit.frequency}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">{completionRate} times completed</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEditing(habit)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Today's Progress
                </div>
                <button
                  onClick={() => toggleHabitCompletion(habit.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-green-500 text-white scale-110'
                      : 'border-2 border-gray-300 hover:border-green-500'
                  }`}
                >
                  {isCompleted && <Check className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {habits.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No habits yet</h3>
          <p className="text-gray-500 mb-6">Start building healthy habits today!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Create Your First Habit</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;