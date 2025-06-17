import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, MessageSquare, Calendar, CreditCard as Edit3, Heart } from 'lucide-react-native';

const progressSegments = [
  { title: 'Matches Revealed', icon: Heart, completed: true },
  { title: 'Chats Active', icon: MessageSquare, completed: true },
  { title: 'Date Booking', icon: Calendar, completed: false },
];

const quickActions = [
  {
    title: 'View Today\'s Dog Matches',
    subtitle: 'Explore new pups ready for a date!',
    icon: Search,
    cta: 'Let\'s Go',
    color: '#8EC6DB',
    route: '/(tabs)/explore',
  },
  {
    title: 'Continue Compatibility Quiz',
    subtitle: 'Answer fun dog-style questions to improve your matches.',
    icon: Edit3,
    cta: 'Continue Quiz',
    color: '#FBBF77',
    route: '/(tabs)/explore',
  },
  {
    title: 'See Who You Matched',
    subtitle: 'View your 5 active matches and their dogs.',
    icon: Heart,
    cta: 'View Matches',
    color: '#F86F6F',
    route: '/(tabs)/matches',
  },
  {
    title: 'Update My Profile',
    subtitle: 'Add new tags, update prompts, or choose a new dog avatar.',
    icon: Edit3,
    cta: 'Edit Profile',
    color: '#7AC79E',
    route: '/(tabs)/profile',
  },
];

export default function HomeScreen() {
  const router = useRouter();

  const handleActionPress = (action: typeof quickActions[0]) => {
    if (action.route) {
      router.push(action.route as any);
    } else {
      Alert.alert('Coming Soon', `${action.title} feature will be available soon!`);
    }
  };

  const handleBookDate = () => {
    Alert.alert(
      'Book Your Dog Date',
      'Ready to meet your match at a local shelter? This feature will help you schedule your first date!',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Go to Matches',
          onPress: () => router.push('/(tabs)/matches')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back, Jamie! 🐾</Text>
          <Text style={styles.subText}>Max missed you!</Text>
        </View>

        {/* Match Cycle Progress */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Your PuppyLove Journey</Text>
          <View style={styles.progressBar}>
            {progressSegments.map((segment, index) => (
              <View key={index} style={styles.progressSegment}>
                <View
                  style={[
                    styles.progressIcon,
                    { backgroundColor: segment.completed ? '#7AC79E' : '#B5C1B6' }
                  ]}
                >
                  <segment.icon size={16} color="white" strokeWidth={2} />
                </View>
                <Text style={[
                  styles.progressLabel,
                  { color: segment.completed ? '#7AC79E' : '#B5C1B6' }
                ]}>
                  {segment.title}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.progressText}>
            You've completed 3 of 5 matches · 2 chats active · 1 day left to book your dog date
          </Text>
        </View>

        {/* Quick Action Cards */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { borderLeftColor: action.color }]}
                onPress={() => handleActionPress(action)}
                activeOpacity={0.7}
              >
                <View style={styles.actionHeader}>
                  <action.icon size={24} color={action.color} strokeWidth={2} />
                  <Text style={styles.actionTitle}>{action.title}</Text>
                </View>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                <View style={[styles.actionButton, { backgroundColor: action.color }]}>
                  <Text style={styles.actionButtonText}>{action.cta}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Rotating Nudge Banner */}
        <TouchableOpacity 
          style={styles.nudgeBanner}
          onPress={handleBookDate}
          activeOpacity={0.8}
        >
          <Text style={styles.nudgeText}>
            Don't let Max down — book your shelter date today 🐾
          </Text>
        </TouchableOpacity>

        {/* Footer CTA */}
        <View style={styles.footerSection}>
          <Text style={styles.footerText}>Haven't booked your dog date yet?</Text>
          <TouchableOpacity 
            style={styles.bookButton} 
            onPress={handleBookDate}
            activeOpacity={0.8}
          >
            <Text style={styles.bookButtonText}>Book Now 🐾</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#444B5A',
    textAlign: 'center',
  },
  subText: {
    fontSize: 16,
    color: '#B5C1B6',
    marginTop: 4,
  },
  progressSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444B5A',
    marginBottom: 16,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressSegment: {
    flex: 1,
    alignItems: 'center',
  },
  progressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressText: {
    fontSize: 14,
    color: '#B5C1B6',
    textAlign: 'center',
    lineHeight: 20,
  },
  actionsSection: {
    marginBottom: 32,
  },
  actionsGrid: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444B5A',
    marginLeft: 12,
    flex: 1,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#B5C1B6',
    lineHeight: 20,
    marginBottom: 16,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  nudgeBanner: {
    backgroundColor: '#FBBF77',
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  nudgeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444B5A',
    textAlign: 'center',
  },
  footerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  footerText: {
    fontSize: 16,
    color: '#444B5A',
    marginBottom: 16,
  },
  bookButton: {
    backgroundColor: '#F86F6F',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    minWidth: 160,
    alignItems: 'center',
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});