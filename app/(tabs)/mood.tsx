import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Plus } from 'lucide-react-native';
import { useWellnessData } from '@/hooks/useWellnessData';

const MOODS = [
  { emoji: '😊', mood: 'Happy', color: '#FFD93D' },
  { emoji: '😔', mood: 'Sad', color: '#6BB6FF' },
  { emoji: '😴', mood: 'Tired', color: '#A8E6CF' },
  { emoji: '😤', mood: 'Angry', color: '#FF6B6B' },
  { emoji: '😰', mood: 'Anxious', color: '#FFB347' },
  { emoji: '😌', mood: 'Calm', color: '#DDA0DD' },
  { emoji: '🤗', mood: 'Grateful', color: '#98FB98' },
  { emoji: '😎', mood: 'Confident', color: '#87CEEB' },
];

export default function MoodScreen() {
  const { data, addMoodEntry, getTodayMood } = useWellnessData();
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedEmoji, setSelectedEmoji] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);

  const todayMood = getTodayMood();

  const handleMoodSelect = (emoji: string, mood: string) => {
    setSelectedEmoji(emoji);
    setSelectedMood(mood);
  };

  const handleSaveMood = () => {
    if (!selectedMood || !selectedEmoji) {
      Alert.alert('Please select a mood');
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    
    addMoodEntry({
      date: today,
      emoji: selectedEmoji,
      mood: selectedMood,
      note: note.trim() || undefined,
    });

    setSelectedMood('');
    setSelectedEmoji('');
    setNote('');
    setShowAddForm(false);
    
    Alert.alert('Mood saved!', 'Your mood has been recorded for today.');
  };

  const recentMoods = data.moods.slice(0, 7);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#ff9a9e', '#fecfef']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mood Journal</Text>
        <Text style={styles.headerSubtitle}>Track your emotional wellness</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Mood */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Mood</Text>
          
          {todayMood ? (
            <View style={styles.todayMoodCard}>
              <Text style={styles.todayMoodEmoji}>{todayMood.emoji}</Text>
              <View style={styles.todayMoodInfo}>
                <Text style={styles.todayMoodText}>{todayMood.mood}</Text>
                {todayMood.note && (
                  <Text style={styles.todayMoodNote}>"{todayMood.note}"</Text>
                )}
                <Text style={styles.todayMoodTime}>
                  {new Date(todayMood.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addMoodButton}
              onPress={() => setShowAddForm(true)}
            >
              <Plus size={24} color="#667eea" />
              <Text style={styles.addMoodText}>Add today's mood</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Add Mood Form */}
        {showAddForm && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How are you feeling?</Text>
            
            <View style={styles.moodGrid}>
              {MOODS.map((moodItem) => (
                <TouchableOpacity
                  key={moodItem.mood}
                  style={[
                    styles.moodOption,
                    selectedMood === moodItem.mood && {
                      backgroundColor: moodItem.color,
                      transform: [{ scale: 1.1 }],
                    },
                  ]}
                  onPress={() => handleMoodSelect(moodItem.emoji, moodItem.mood)}
                >
                  <Text style={styles.moodEmoji}>{moodItem.emoji}</Text>
                  <Text style={styles.moodLabel}>{moodItem.mood}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.noteSection}>
              <Text style={styles.noteLabel}>Add a note (optional)</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="What's on your mind?"
                value={note}
                onChangeText={setNote}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowAddForm(false);
                  setSelectedMood('');
                  setSelectedEmoji('');
                  setNote('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  !selectedMood && styles.saveButtonDisabled,
                ]}
                onPress={handleSaveMood}
                disabled={!selectedMood}
              >
                <Text style={styles.saveButtonText}>Save Mood</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Recent Moods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Moods</Text>
          
          {recentMoods.length > 0 ? (
            recentMoods.map((mood) => (
              <View key={mood.id} style={styles.moodHistoryItem}>
                <View style={styles.moodHistoryLeft}>
                  <Text style={styles.moodHistoryEmoji}>{mood.emoji}</Text>
                  <View style={styles.moodHistoryInfo}>
                    <Text style={styles.moodHistoryMood}>{mood.mood}</Text>
                    <Text style={styles.moodHistoryDate}>
                      {new Date(mood.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>
                {mood.note && (
                  <Text style={styles.moodHistoryNote} numberOfLines={2}>
                    "{mood.note}"
                  </Text>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No mood entries yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start tracking your daily emotions
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  todayMoodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  todayMoodEmoji: {
    fontSize: 48,
    marginRight: 20,
  },
  todayMoodInfo: {
    flex: 1,
  },
  todayMoodText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  todayMoodNote: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 5,
  },
  todayMoodTime: {
    fontSize: 14,
    color: '#999',
  },
  addMoodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#667eea',
    borderStyle: 'dashed',
  },
  addMoodText: {
    fontSize: 16,
    color: '#667eea',
    marginLeft: 10,
    fontWeight: '600',
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  moodOption: {
    width: '22%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  moodLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  noteSection: {
    marginBottom: 20,
  },
  noteLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#667eea',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginLeft: 10,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  moodHistoryItem: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  moodHistoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  moodHistoryEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  moodHistoryInfo: {
    flex: 1,
  },
  moodHistoryMood: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  moodHistoryDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  moodHistoryNote: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginLeft: 47,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 15,
    fontWeight: '600',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});