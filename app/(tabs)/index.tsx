import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Droplets, Target, TrendingUp } from 'lucide-react-native';
import { useWellnessData } from '@/hooks/useWellnessData';
import { ProgressCircle } from '@/components/ProgressCircle';

export default function DashboardScreen() {
  const {
    data,
    loading,
    getTodayHydration,
    getTodayHabitEntries,
    getTodayMood,
  } = useWellnessData();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading your wellness data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const todayHydration = getTodayHydration();
  const todayHabitEntries = getTodayHabitEntries();
  const todayMood = getTodayMood();

  const calculateHabitCompletion = () => {
    if (data.habits.length === 0) return 0;
    
    const completedHabits = todayHabitEntries.filter(entry => {
      const habit = data.habits.find(h => h.id === entry.habitId);
      return habit && entry.value >= habit.target;
    }).length;
    
    return Math.round((completedHabits / data.habits.length) * 100);
  };

  const habitCompletion = calculateHabitCompletion();
  const hydrationProgress = Math.min((todayHydration / 2000) * 100, 100);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Wellness Dashboard</Text>
        <Text style={styles.headerSubtitle}>
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          
          <View style={styles.progressGrid}>
            <View style={styles.progressCard}>
              <ProgressCircle
                progress={habitCompletion}
                size={80}
                strokeWidth={8}
                color="#4ECDC4"
              >
                <Text style={styles.progressValue}>{habitCompletion}%</Text>
              </ProgressCircle>
              <Text style={styles.progressLabel}>Habits</Text>
            </View>

            <View style={styles.progressCard}>
              <ProgressCircle
                progress={hydrationProgress}
                size={80}
                strokeWidth={8}
                color="#45B7D1"
              >
                <Text style={styles.progressValue}>{Math.round(hydrationProgress)}%</Text>
              </ProgressCircle>
              <Text style={styles.progressLabel}>Hydration</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          
          <View style={styles.statsGrid}>
            <TouchableOpacity style={[styles.statCard, { backgroundColor: '#FFE5E5' }]}>
              <Heart size={24} color="#FF6B6B" />
              <Text style={styles.statValue}>
                {todayMood ? todayMood.emoji : '😊'}
              </Text>
              <Text style={styles.statLabel}>Today's Mood</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.statCard, { backgroundColor: '#E5F4FF' }]}>
              <Droplets size={24} color="#45B7D1" />
              <Text style={styles.statValue}>{todayHydration}ml</Text>
              <Text style={styles.statLabel}>Water Intake</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.statCard, { backgroundColor: '#E5FFE5' }]}>
              <Target size={24} color="#4ECDC4" />
              <Text style={styles.statValue}>
                {todayHabitEntries.filter(e => e.completed).length}/{data.habits.length}
              </Text>
              <Text style={styles.statLabel}>Habits Done</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.statCard, { backgroundColor: '#FFF5E5' }]}>
              <TrendingUp size={24} color="#FFA726" />
              <Text style={styles.statValue}>
                {data.moods.length > 7 ? '📈' : '🌱'}
              </Text>
              <Text style={styles.statLabel}>Streak</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Habits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          
          {data.habits.map(habit => {
            const entry = todayHabitEntries.find(e => e.habitId === habit.id);
            const progress = entry ? Math.min((entry.value / habit.target) * 100, 100) : 0;
            
            return (
              <View key={habit.id} style={styles.habitItem}>
                <View style={styles.habitInfo}>
                  <Text style={styles.habitIcon}>{habit.icon}</Text>
                  <View style={styles.habitDetails}>
                    <Text style={styles.habitName}>{habit.name}</Text>
                    <Text style={styles.habitTarget}>
                      {entry?.value || 0} / {habit.target} {habit.unit}
                    </Text>
                  </View>
                </View>
                <View style={styles.habitProgress}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${progress}%`, backgroundColor: habit.color },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>{Math.round(progress)}%</Text>
                </View>
              </View>
            );
          })}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
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
  progressGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  progressCard: {
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
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  habitItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  habitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  habitIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  habitDetails: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  habitTarget: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  habitProgress: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  progressBar: {
    width: 60,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
});