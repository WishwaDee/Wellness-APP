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
import { Target, Plus, Minus, CheckCircle, Circle } from 'lucide-react-native';
import { useWellnessData } from '@/hooks/useWellnessData';
import { ProgressCircle } from '@/components/ProgressCircle';

export default function HabitsScreen() {
  const { data, updateHabitEntry, getTodayHabitEntries } = useWellnessData();
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const todayHabitEntries = getTodayHabitEntries();

  const getHabitProgress = (habitId: string) => {
    const habit = data.habits.find(h => h.id === habitId);
    const entry = todayHabitEntries.find(e => e.habitId === habitId);
    
    if (!habit) return { progress: 0, current: 0, target: 0, unit: '' };
    
    const current = entry?.value || 0;
    const progress = Math.min((current / habit.target) * 100, 100);
    
    return {
      progress,
      current,
      target: habit.target,
      unit: habit.unit,
    };
  };

  const handleUpdateHabit = (habitId: string, newValue: number) => {
    updateHabitEntry(habitId, newValue);
    
    const habit = data.habits.find(h => h.id === habitId);
    if (habit && newValue >= habit.target) {
      const entry = todayHabitEntries.find(e => e.habitId === habitId);
      if (!entry || entry.value < habit.target) {
        Alert.alert(
          '🎉 Habit Completed!',
          `Great job completing your ${habit.name} goal!`,
          [{ text: 'Awesome!', style: 'default' }]
        );
      }
    }
  };

  const handleQuickUpdate = (habitId: string, increment: number) => {
    const current = getHabitProgress(habitId).current;
    const newValue = Math.max(0, current + increment);
    handleUpdateHabit(habitId, newValue);
  };

  const handleEditSave = (habitId: string) => {
    const value = parseFloat(editValue) || 0;
    handleUpdateHabit(habitId, value);
    setEditingHabit(null);
    setEditValue('');
  };

  const calculateOverallProgress = () => {
    if (data.habits.length === 0) return 0;
    
    const completedHabits = data.habits.filter(habit => {
      const progress = getHabitProgress(habit.id);
      return progress.current >= progress.target;
    }).length;
    
    return Math.round((completedHabits / data.habits.length) * 100);
  };

  const overallProgress = calculateOverallProgress();
  const completedCount = data.habits.filter(habit => {
    const progress = getHabitProgress(habit.id);
    return progress.current >= progress.target;
  }).length;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4ECDC4', '#44A08D']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Daily Habits</Text>
        <Text style={styles.headerSubtitle}>Build better habits, one day at a time</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overall Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          
          <View style={styles.overallProgressContainer}>
            <ProgressCircle
              progress={overallProgress}
              size={120}
              strokeWidth={10}
              color="#4ECDC4"
            >
              <View style={styles.progressContent}>
                <Text style={styles.progressValue}>{overallProgress}%</Text>
                <Text style={styles.progressLabel}>Complete</Text>
              </View>
            </ProgressCircle>
            
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <CheckCircle size={20} color="#4ECDC4" />
                <Text style={styles.statValue}>{completedCount}</Text>
                <Text style={styles.statLabel}>Completed</Text>
              </View>
              
              <View style={styles.statItem}>
                <Target size={20} color="#FF6B6B" />
                <Text style={styles.statValue}>{data.habits.length - completedCount}</Text>
                <Text style={styles.statLabel}>Remaining</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Habits List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Habits</Text>
          
          {data.habits.map((habit) => {
            const progress = getHabitProgress(habit.id);
            const isCompleted = progress.current >= progress.target;
            const isEditing = editingHabit === habit.id;
            
            return (
              <View key={habit.id} style={styles.habitCard}>
                <View style={styles.habitHeader}>
                  <View style={styles.habitInfo}>
                    <Text style={styles.habitIcon}>{habit.icon}</Text>
                    <View style={styles.habitDetails}>
                      <Text style={styles.habitName}>{habit.name}</Text>
                      <Text style={styles.habitTarget}>
                        Goal: {habit.target} {habit.unit}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.habitStatus}>
                    {isCompleted ? (
                      <CheckCircle size={24} color="#4ECDC4" />
                    ) : (
                      <Circle size={24} color="#E0E0E0" />
                    )}
                  </View>
                </View>

                <View style={styles.habitProgress}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { 
                          width: `${progress.progress}%`,
                          backgroundColor: habit.color,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {progress.current} / {progress.target} {progress.unit}
                  </Text>
                </View>

                <View style={styles.habitControls}>
                  {isEditing ? (
                    <View style={styles.editContainer}>
                      <TextInput
                        style={styles.editInput}
                        value={editValue}
                        onChangeText={setEditValue}
                        placeholder={progress.current.toString()}
                        keyboardType="numeric"
                        autoFocus
                      />
                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => handleEditSave(habit.id)}
                      >
                        <Text style={styles.saveButtonText}>Save</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => {
                          setEditingHabit(null);
                          setEditValue('');
                        }}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.controlButtons}>
                      <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => handleQuickUpdate(habit.id, -1)}
                      >
                        <Minus size={16} color="#666" />
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.valueButton}
                        onPress={() => {
                          setEditingHabit(habit.id);
                          setEditValue(progress.current.toString());
                        }}
                      >
                        <Text style={styles.valueButtonText}>
                          {progress.current}
                        </Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => handleQuickUpdate(habit.id, 1)}
                      >
                        <Plus size={16} color="#666" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Habit Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habit Building Tips</Text>
          
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <Text style={styles.tipEmoji}>🎯</Text>
              <Text style={styles.tipText}>
                Start small - even 5 minutes counts as progress
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Text style={styles.tipEmoji}>📅</Text>
              <Text style={styles.tipText}>
                Consistency beats perfection - aim for daily practice
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Text style={styles.tipEmoji}>🔗</Text>
              <Text style={styles.tipText}>
                Stack new habits with existing routines
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Text style={styles.tipEmoji}>🎉</Text>
              <Text style={styles.tipText}>
                Celebrate small wins to build momentum
              </Text>
            </View>
          </View>
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
  overallProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  progressLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  progressStats: {
    flex: 1,
    marginLeft: 30,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
    marginRight: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  habitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  habitDetails: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  habitTarget: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  habitStatus: {
    marginLeft: 10,
  },
  habitProgress: {
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  habitControls: {
    alignItems: 'center',
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  valueButton: {
    minWidth: 60,
    height: 36,
    backgroundColor: '#4ECDC4',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  valueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  editInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: 'center',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  tipsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  tipEmoji: {
    fontSize: 20,
    marginRight: 15,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    lineHeight: 20,
  },
});