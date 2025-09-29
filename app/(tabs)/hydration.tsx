import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Droplets, Plus, Minus, Award } from 'lucide-react-native';
import { useWellnessData } from '@/hooks/useWellnessData';
import { ProgressCircle } from '@/components/ProgressCircle';

const WATER_AMOUNTS = [250, 500, 750, 1000];
const DAILY_GOAL = 2000; // 2 liters

export default function HydrationScreen() {
  const { data, addHydrationEntry, getTodayHydration } = useWellnessData();
  const [customAmount, setCustomAmount] = useState(250);

  const todayHydration = getTodayHydration();
  const progress = Math.min((todayHydration / DAILY_GOAL) * 100, 100);
  const remainingAmount = Math.max(DAILY_GOAL - todayHydration, 0);

  const handleAddWater = (amount: number) => {
    addHydrationEntry(amount);
    
    const newTotal = todayHydration + amount;
    if (newTotal >= DAILY_GOAL && todayHydration < DAILY_GOAL) {
      Alert.alert(
        '🎉 Goal Achieved!',
        'Congratulations! You\'ve reached your daily hydration goal!',
        [{ text: 'Awesome!', style: 'default' }]
      );
    }
  };

  const getRecentHydration = () => {
    return data.hydration
      .slice(0, 7)
      .map(entry => ({
        ...entry,
        date: new Date(entry.date).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
      }));
  };

  const recentHydration = getRecentHydration();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Hydration Tracker</Text>
        <Text style={styles.headerSubtitle}>Stay hydrated, stay healthy</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today's Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          
          <View style={styles.progressContainer}>
            <ProgressCircle
              progress={progress}
              size={150}
              strokeWidth={12}
              color="#45B7D1"
            >
              <View style={styles.progressContent}>
                <Text style={styles.progressAmount}>{todayHydration}</Text>
                <Text style={styles.progressUnit}>ml</Text>
                <Text style={styles.progressGoal}>of {DAILY_GOAL}ml</Text>
              </View>
            </ProgressCircle>

            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Droplets size={20} color="#45B7D1" />
                <Text style={styles.statValue}>{Math.round(progress)}%</Text>
                <Text style={styles.statLabel}>Complete</Text>
              </View>
              
              <View style={styles.statItem}>
                <Award size={20} color="#4ECDC4" />
                <Text style={styles.statValue}>{remainingAmount}</Text>
                <Text style={styles.statLabel}>ml left</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Add */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Add</Text>
          
          <View style={styles.quickAddGrid}>
            {WATER_AMOUNTS.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={styles.quickAddButton}
                onPress={() => handleAddWater(amount)}
              >
                <Droplets size={24} color="#45B7D1" />
                <Text style={styles.quickAddText}>{amount}ml</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Custom Amount */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Amount</Text>
          
          <View style={styles.customAmountContainer}>
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => setCustomAmount(Math.max(50, customAmount - 50))}
            >
              <Minus size={20} color="#666" />
            </TouchableOpacity>
            
            <View style={styles.customAmountDisplay}>
              <Text style={styles.customAmountText}>{customAmount}ml</Text>
            </View>
            
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => setCustomAmount(Math.min(2000, customAmount + 50))}
            >
              <Plus size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.addCustomButton}
            onPress={() => handleAddWater(customAmount)}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addCustomText}>Add {customAmount}ml</Text>
          </TouchableOpacity>
        </View>

        {/* Recent History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent History</Text>
          
          {recentHydration.length > 0 ? (
            recentHydration.map((entry) => {
              const dayProgress = Math.min((entry.amount / DAILY_GOAL) * 100, 100);
              
              return (
                <View key={entry.id} style={styles.historyItem}>
                  <View style={styles.historyLeft}>
                    <Text style={styles.historyDate}>{entry.date}</Text>
                    <Text style={styles.historyAmount}>{entry.amount}ml</Text>
                  </View>
                  
                  <View style={styles.historyRight}>
                    <View style={styles.historyProgressBar}>
                      <View
                        style={[
                          styles.historyProgressFill,
                          { width: `${dayProgress}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.historyPercentage}>
                      {Math.round(dayProgress)}%
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Droplets size={48} color="#ccc" />
              <Text style={styles.emptyStateText}>No hydration data yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start tracking your water intake
              </Text>
            </View>
          )}
        </View>

        {/* Hydration Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hydration Tips</Text>
          
          <View style={styles.tipsContainer}>
            <View style={styles.tipItem}>
              <Text style={styles.tipEmoji}>💧</Text>
              <Text style={styles.tipText}>
                Drink a glass of water when you wake up
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Text style={styles.tipEmoji}>⏰</Text>
              <Text style={styles.tipText}>
                Set reminders every 2 hours during the day
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Text style={styles.tipEmoji}>🍎</Text>
              <Text style={styles.tipText}>
                Eat water-rich foods like fruits and vegetables
              </Text>
            </View>
            
            <View style={styles.tipItem}>
              <Text style={styles.tipEmoji}>🏃‍♂️</Text>
              <Text style={styles.tipText}>
                Drink extra water before, during, and after exercise
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
  progressContainer: {
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
  progressAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  progressUnit: {
    fontSize: 14,
    color: '#666',
  },
  progressGoal: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  progressStats: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  quickAddGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAddButton: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickAddText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  customButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customAmountDisplay: {
    marginHorizontal: 30,
    alignItems: 'center',
  },
  customAmountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addCustomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#45B7D1',
    padding: 15,
    borderRadius: 15,
  },
  addCustomText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  historyItem: {
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
  historyLeft: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyAmount: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  historyRight: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  historyProgressBar: {
    width: 60,
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 5,
  },
  historyProgressFill: {
    height: '100%',
    backgroundColor: '#45B7D1',
    borderRadius: 3,
  },
  historyPercentage: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
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