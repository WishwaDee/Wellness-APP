import React, { useState } from 'react';
import { Plus, Calendar, Heart, CreditCard as Edit3, Trash2 } from 'lucide-react';
import { MoodEntry } from '../types';

interface MoodJournalProps {
  moodEntries: MoodEntry[];
  setMoodEntries: (entries: MoodEntry[]) => void;
}

const MoodJournal: React.FC<MoodJournalProps> = ({ moodEntries, setMoodEntries }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);
  const [newEntry, setNewEntry] = useState({
    mood: '😊',
    moodLabel: 'Happy',
    note: '',
    rating: 3
  });

  const moodOptions = [
    { emoji: '😢', label: 'Very Sad', rating: 1, color: '#EF4444' },
    { emoji: '😔', label: 'Sad', rating: 2, color: '#F97316' },
    { emoji: '😐', label: 'Neutral', rating: 3, color: '#6B7280' },
    { emoji: '😊', label: 'Happy', rating: 4, color: '#10B981' },
    { emoji: '😍', label: 'Very Happy', rating: 5, color: '#8B5CF6' }
  ];

  const addEntry = () => {
    if (newEntry.mood && newEntry.moodLabel) {
      const entry: MoodEntry = {
        id: Date.now().toString(),
        mood: newEntry.mood,
        moodLabel: newEntry.moodLabel,
        note: newEntry.note,
        rating: newEntry.rating,
        date: new Date().toISOString()
      };
      setMoodEntries([entry, ...moodEntries]);
      setNewEntry({ mood: '😊', moodLabel: 'Happy', note: '', rating: 3 });
      setShowAddForm(false);
    }
  };

  const updateEntry = () => {
    if (editingEntry) {
      const updatedEntries = moodEntries.map(entry =>
        entry.id === editingEntry.id
          ? { ...entry, ...newEntry, date: editingEntry.date }
          : entry
      );
      setMoodEntries(updatedEntries);
      setEditingEntry(null);
      setNewEntry({ mood: '😊', moodLabel: 'Happy', note: '', rating: 3 });
      setShowAddForm(false);
    }
  };

  const deleteEntry = (entryId: string) => {
    setMoodEntries(moodEntries.filter(entry => entry.id !== entryId));
  };

  const startEditing = (entry: MoodEntry) => {
    setEditingEntry(entry);
    setNewEntry({
      mood: entry.mood,
      moodLabel: entry.moodLabel,
      note: entry.note,
      rating: entry.rating
    });
    setShowAddForm(true);
  };

  const cancelEditing = () => {
    setEditingEntry(null);
    setNewEntry({ mood: '😊', moodLabel: 'Happy', note: '', rating: 3 });
    setShowAddForm(false);
  };

  const selectMood = (mood: typeof moodOptions[0]) => {
    setNewEntry({
      ...newEntry,
      mood: mood.emoji,
      moodLabel: mood.label,
      rating: mood.rating
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: '2-digit' 
      });
    }
  };

  const getAverageMood = () => {
    if (moodEntries.length === 0) return 0;
    const total = moodEntries.reduce((sum, entry) => sum + entry.rating, 0);
    return (total / moodEntries.length).toFixed(1);
  };

  const getRecentTrend = () => {
    if (moodEntries.length < 2) return 'neutral';
    const recent = moodEntries.slice(0, 3);
    const older = moodEntries.slice(3, 6);
    
    if (older.length === 0) return 'neutral';
    
    const recentAvg = recent.reduce((sum, entry) => sum + entry.rating, 0) / recent.length;
    const olderAvg = older.reduce((sum, entry) => sum + entry.rating, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.3) return 'improving';
    if (recentAvg < olderAvg - 0.3) return 'declining';
    return 'stable';
  };

  const trend = getRecentTrend();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mood Journal</h2>
          <p className="text-gray-600">Track your emotional well-being</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Log Mood</span>
        </button>
      </div>

      {/* Mood Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Average Mood</h3>
            <Heart className="w-5 h-5 text-purple-500" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-purple-600">{getAverageMood()}</span>
            <span className="text-sm text-gray-500">/5.0</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Total Entries</h3>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-2xl font-bold text-blue-600">{moodEntries.length}</span>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-900">Recent Trend</h3>
            <div className={`w-3 h-3 rounded-full ${
              trend === 'improving' ? 'bg-green-500' :
              trend === 'declining' ? 'bg-red-500' : 'bg-yellow-500'
            }`} />
          </div>
          <span className="text-sm font-medium capitalize text-gray-700">
            {trend === 'improving' ? '📈 Improving' :
             trend === 'declining' ? '📉 Needs attention' : '➡️ Stable'}
          </span>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            {editingEntry ? 'Edit Mood Entry' : 'How are you feeling?'}
          </h3>
          
          <div className="space-y-6">
            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Select your mood</label>
              <div className="grid grid-cols-5 gap-3">
                {moodOptions.map(mood => (
                  <button
                    key={mood.emoji}
                    onClick={() => selectMood(mood)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      newEntry.mood === mood.emoji
                        ? 'border-purple-500 bg-purple-50 scale-105'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{mood.emoji}</div>
                    <div className="text-xs font-medium text-gray-600">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What's on your mind? (Optional)
              </label>
              <textarea
                value={newEntry.note}
                onChange={(e) => setNewEntry({ ...newEntry, note: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={3}
                placeholder="Share your thoughts, experiences, or what influenced your mood today..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelEditing}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingEntry ? updateEntry : addEntry}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {editingEntry ? 'Update Entry' : 'Save Entry'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mood Entries */}
      <div className="space-y-4">
        {moodEntries.map(entry => {
          const moodData = moodOptions.find(m => m.rating === entry.rating);
          return (
            <div key={entry.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: moodData?.color + '20' }}
                  >
                    {entry.mood}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{entry.moodLabel}</h3>
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < entry.rating ? 'bg-purple-500' : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{formatDate(entry.date)}</p>
                    {entry.note && (
                      <p className="text-gray-700">{entry.note}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => startEditing(entry)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {moodEntries.length === 0 && !showAddForm && (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No mood entries yet</h3>
          <p className="text-gray-500 mb-6">Start tracking your emotions today!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            <span>Log Your First Mood</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodJournal;