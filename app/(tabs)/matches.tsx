import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MessageCircle, Calendar, Clock, Heart, User } from 'lucide-react-native';

const timelineSteps = [
  { icon: Heart, label: 'Match Made', completed: true },
  { icon: MessageCircle, label: 'Active Chat', completed: true },
  { icon: User, label: 'Dog Mini-Match', completed: false },
  { icon: Calendar, label: 'Date Confirmed', completed: false },
];

const matches = [
  {
    id: 1,
    name: 'Sarah',
    city: 'Brooklyn',
    dogAvatar: '🐕‍🦺',
    tags: ['Spontaneous Adventurer', 'Couch Cuddler', 'Patient with Dogs'],
    status: 'chat_active',
    statusText: 'Chat Active 💬',
    buttonText: 'Keep Chatting',
    backgroundColor: '#8EC6DB',
    reminder: null,
  },
  {
    id: 2,
    name: 'Maya',
    city: 'Manhattan',
    dogAvatar: '🐶',
    tags: ['Morning Person', 'Nature-Loving', 'Dog-Park Regular'],
    status: 'awaiting_message',
    statusText: 'Awaiting Message 🕒',
    buttonText: 'Message Now',
    backgroundColor: '#FBBF77',
    reminder: 'Don\'t let this match expire — 2 messages left today',
  },
  {
    id: 3,
    name: 'Emma',
    city: 'Queens',
    dogAvatar: '🦮',
    tags: ['Calm & Grounded', 'Shelter Volunteer', 'Likes Routine'],
    status: 'dog_date_unlocked',
    statusText: 'Dog Date Unlocked 🐾',
    buttonText: 'Book Dog Date',
    backgroundColor: '#7AC79E',
    reminder: '1 day left to book your dog date',
  },
  {
    id: 4,
    name: 'Jess',
    city: 'Williamsburg',
    dogAvatar: '🐕',
    tags: ['Goofball Energy', 'Spontaneous', 'High Energy'],
    status: 'expired',
    statusText: 'Expired ❌',
    buttonText: null,
    backgroundColor: '#B5C1B6',
    reminder: null,
  },
];

export default function MatchesScreen() {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'chat_active': return '#8EC6DB';
      case 'awaiting_message': return '#FBBF77';
      case 'dog_date_unlocked': return '#7AC79E';
      case 'expired': return '#B5C1B6';
      default: return '#B5C1B6';
    }
  };

  const handleMatchAction = (match: typeof matches[0]) => {
    switch (match.status) {
      case 'chat_active':
      case 'awaiting_message':
        router.push('/(tabs)/chat');
        break;
      case 'dog_date_unlocked':
        Alert.alert(
          'Book Your Dog Date! 🐾',
          `Ready to meet ${match.name} at a local shelter? Choose a shelter, pick a dog, and schedule your first date together!`,
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Book Date',
              onPress: () => {
                Alert.alert(
                  'Booking Feature',
                  'The dog date booking feature will help you:\n\n• Choose a nearby shelter\n• Pick a dog together\n• Schedule your meeting time\n• Get confirmation details',
                  [{ text: 'Got it!' }]
                );
              }
            }
          ]
        );
        break;
      default:
        Alert.alert('Match Expired', 'This match has expired. Keep exploring to find new connections!');
    }
  };

  const handleChooseDogsTogther = () => {
    Alert.alert(
      'Choose Dogs Together! 🐾',
      'You and Sarah will both pick your favorite dogs from the available options. Once you both choose, you can book your date!',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Start Choosing',
          onPress: () => {
            Alert.alert(
              'Dog Selection',
              'This feature will let you and your match browse available dogs at local shelters and pick your favorites together!',
              [{ text: 'Sounds great!' }]
            );
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Current Matches</Text>
          <Text style={styles.subtitle}>Match Cycle – Day 2 of 5</Text>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          <View style={styles.timeline}>
            {timelineSteps.map((step, index) => (
              <View key={index} style={styles.timelineStep}>
                <View
                  style={[
                    styles.timelineIcon,
                    { backgroundColor: step.completed ? '#8EC6DB' : '#B5C1B6' }
                  ]}
                >
                  <step.icon size={16} color="white" strokeWidth={2} />
                </View>
                <Text
                  style={[
                    styles.timelineLabel,
                    { color: step.completed ? '#8EC6DB' : '#B5C1B6' }
                  ]}
                >
                  {step.label}
                </Text>
                {index < timelineSteps.length - 1 && (
                  <View
                    style={[
                      styles.timelineConnector,
                      { backgroundColor: step.completed ? '#8EC6DB' : '#B5C1B6' }
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Matches List */}
        <View style={styles.matchesContainer}>
          {matches.map((match) => (
            <View key={match.id} style={styles.matchCard}>
              <View style={styles.matchHeader}>
                <View style={styles.userInfo}>
                  <Text style={styles.dogAvatar}>{match.dogAvatar}</Text>
                  <View style={styles.userDetails}>
                    <Text style={styles.userName}>{match.name}</Text>
                    <Text style={styles.userCity}>{match.city}</Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(match.status) }
                  ]}
                >
                  <Text style={styles.statusText}>{match.statusText}</Text>
                </View>
              </View>

              <View style={styles.tagsContainer}>
                {match.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

              {match.reminder && (
                <View style={styles.reminderBanner}>
                  <Clock size={16} color="#F86F6F" strokeWidth={2} />
                  <Text style={styles.reminderText}>{match.reminder}</Text>
                </View>
              )}

              {match.buttonText && (
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: getStatusColor(match.status) }
                  ]}
                  onPress={() => handleMatchAction(match)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.actionButtonText}>{match.buttonText}</Text>
                </TouchableOpacity>
              )}

              {match.status === 'expired' && (
                <View style={styles.expiredOverlay}>
                  <Text style={styles.expiredText}>This match has expired</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Dog Mini-Match Alert */}
        <View style={styles.miniMatchAlert}>
          <View style={styles.alertHeader}>
            <Heart size={20} color="#F86F6F" strokeWidth={2} />
            <Text style={styles.alertTitle}>Dog Picks Ready!</Text>
          </View>
          <Text style={styles.alertText}>
            You and Sarah both need to pick a dog for your date. Choose your favorite pup together!
          </Text>
          <TouchableOpacity 
            style={styles.alertButton}
            onPress={handleChooseDogsTogther}
            activeOpacity={0.8}
          >
            <Text style={styles.alertButtonText}>Choose Dogs Together</Text>
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
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#444B5A',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#B5C1B6',
  },
  timelineContainer: {
    marginBottom: 32,
  },
  timeline: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  timelineConnector: {
    position: 'absolute',
    left: 15,
    top: 32,
    width: 2,
    height: 16,
  },
  matchesContainer: {
    gap: 16,
    marginBottom: 32,
  },
  matchCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dogAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444B5A',
    marginBottom: 2,
  },
  userCity: {
    fontSize: 14,
    color: '#B5C1B6',
  },
  statusBadge: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#444B5A',
  },
  reminderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#F86F6F',
  },
  reminderText: {
    fontSize: 12,
    color: '#F86F6F',
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  expiredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(181, 193, 182, 0.8)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expiredText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  miniMatchAlert: {
    backgroundColor: '#FBBF77',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444B5A',
    marginLeft: 8,
  },
  alertText: {
    fontSize: 14,
    color: '#444B5A',
    lineHeight: 20,
    marginBottom: 16,
  },
  alertButton: {
    backgroundColor: '#F86F6F',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  alertButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});