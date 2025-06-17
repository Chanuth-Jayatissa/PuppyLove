import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ChevronLeft, 
  MapPin, 
  Clock, 
  Heart, 
  Calendar,
  Users,
  Star,
  Info
} from 'lucide-react-native';

const mockShelters = [
  {
    id: '1',
    name: 'Brooklyn Animal Rescue',
    address: '123 Park Ave, Brooklyn, NY',
    distance: '2.3 miles',
    rating: 4.8,
    availableDogs: 12,
    image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    nextAvailable: 'Today 2:00 PM',
  },
  {
    id: '2',
    name: 'Manhattan Pet Haven',
    address: '456 Broadway, Manhattan, NY',
    distance: '3.7 miles',
    rating: 4.9,
    availableDogs: 8,
    image: 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg',
    nextAvailable: 'Tomorrow 10:00 AM',
  },
  {
    id: '3',
    name: 'Queens Dog Sanctuary',
    address: '789 Main St, Queens, NY',
    distance: '5.1 miles',
    rating: 4.7,
    availableDogs: 15,
    image: 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg',
    nextAvailable: 'Today 4:30 PM',
  },
];

const mockAvailableDogs = [
  {
    id: '1',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: '2 years',
    size: 'Large',
    personality: ['Friendly', 'Energetic', 'Loves Fetch'],
    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
    shelterId: '1',
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Border Collie',
    age: '1.5 years',
    size: 'Medium',
    personality: ['Smart', 'Gentle', 'Great with Kids'],
    image: 'https://images.pexels.com/photos/97082/pexels-photo-97082.jpeg',
    shelterId: '1',
  },
  {
    id: '3',
    name: 'Max',
    breed: 'Labrador Mix',
    age: '3 years',
    size: 'Large',
    personality: ['Calm', 'Loyal', 'Loves Walks'],
    image: 'https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg',
    shelterId: '2',
  },
];

export default function BookDateScreen() {
  const router = useRouter();
  const [selectedShelter, setSelectedShelter] = useState<string | null>(null);
  const [selectedDog, setSelectedDog] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  const timeSlots = [
    '10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM', '4:00 PM', '5:30 PM'
  ];

  const handleShelterSelect = (shelterId: string) => {
    setSelectedShelter(shelterId);
    setSelectedDog(null); // Reset dog selection when shelter changes
  };

  const handleDogSelect = (dogId: string) => {
    setSelectedDog(dogId);
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleBookDate = () => {
    if (!selectedShelter || !selectedDog || !selectedTimeSlot) {
      Alert.alert(
        'Incomplete Selection',
        'Please select a shelter, dog, and time slot to book your date.'
      );
      return;
    }

    Alert.alert(
      'Date Booked Successfully! 🎉',
      'Your dog date has been confirmed. You and your match will receive confirmation details shortly.',
      [
        {
          text: 'View My Matches',
          onPress: () => router.push('/(tabs)/matches')
        }
      ]
    );
  };

  const getAvailableDogsForShelter = (shelterId: string) => {
    return mockAvailableDogs.filter(dog => dog.shelterId === shelterId);
  };

  const selectedShelterData = mockShelters.find(s => s.id === selectedShelter);
  const selectedDogData = mockAvailableDogs.find(d => d.id === selectedDog);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#444B5A" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Your Dog Date</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Ready for Your Paw-fect Date? 🐾</Text>
            <Text style={styles.subtitle}>
              Choose a shelter, pick a dog, and schedule your first date together!
            </Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressSection}>
            <View style={styles.progressSteps}>
              <View style={[styles.progressStep, styles.activeStep]}>
                <Text style={styles.progressStepNumber}>1</Text>
                <Text style={styles.progressStepText}>Choose Shelter</Text>
              </View>
              <View style={[styles.progressStep, selectedShelter && styles.activeStep]}>
                <Text style={styles.progressStepNumber}>2</Text>
                <Text style={styles.progressStepText}>Pick Dog</Text>
              </View>
              <View style={[styles.progressStep, selectedDog && styles.activeStep]}>
                <Text style={styles.progressStepNumber}>3</Text>
                <Text style={styles.progressStepText}>Schedule</Text>
              </View>
            </View>
          </View>

          {/* Step 1: Shelter Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose a Shelter</Text>
            <View style={styles.shelterList}>
              {mockShelters.map((shelter) => (
                <TouchableOpacity
                  key={shelter.id}
                  style={[
                    styles.shelterCard,
                    selectedShelter === shelter.id && styles.selectedCard
                  ]}
                  onPress={() => handleShelterSelect(shelter.id)}
                  activeOpacity={0.7}
                >
                  <Image source={{ uri: shelter.image }} style={styles.shelterImage} />
                  <View style={styles.shelterInfo}>
                    <Text style={styles.shelterName}>{shelter.name}</Text>
                    <View style={styles.shelterDetails}>
                      <MapPin size={14} color="#B5C1B6" strokeWidth={2} />
                      <Text style={styles.shelterAddress}>{shelter.address}</Text>
                    </View>
                    <View style={styles.shelterMeta}>
                      <View style={styles.shelterMetaItem}>
                        <Star size={14} color="#FBBF77" strokeWidth={2} fill="#FBBF77" />
                        <Text style={styles.shelterRating}>{shelter.rating}</Text>
                      </View>
                      <View style={styles.shelterMetaItem}>
                        <Users size={14} color="#8EC6DB" strokeWidth={2} />
                        <Text style={styles.shelterDogs}>{shelter.availableDogs} dogs</Text>
                      </View>
                      <View style={styles.shelterMetaItem}>
                        <Clock size={14} color="#7AC79E" strokeWidth={2} />
                        <Text style={styles.shelterTime}>{shelter.nextAvailable}</Text>
                      </View>
                    </View>
                  </View>
                  {selectedShelter === shelter.id && (
                    <View style={styles.selectedIndicator}>
                      <Heart size={16} color="white" strokeWidth={2} fill="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Step 2: Dog Selection */}
          {selectedShelter && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pick Your Date Companion</Text>
              <Text style={styles.sectionSubtitle}>
                Available dogs at {selectedShelterData?.name}
              </Text>
              <View style={styles.dogList}>
                {getAvailableDogsForShelter(selectedShelter).map((dog) => (
                  <TouchableOpacity
                    key={dog.id}
                    style={[
                      styles.dogCard,
                      selectedDog === dog.id && styles.selectedCard
                    ]}
                    onPress={() => handleDogSelect(dog.id)}
                    activeOpacity={0.7}
                  >
                    <Image source={{ uri: dog.image }} style={styles.dogImage} />
                    <View style={styles.dogInfo}>
                      <Text style={styles.dogName}>{dog.name}</Text>
                      <Text style={styles.dogBreed}>{dog.breed} • {dog.age} • {dog.size}</Text>
                      <View style={styles.dogPersonality}>
                        {dog.personality.map((trait, index) => (
                          <View key={index} style={styles.personalityTag}>
                            <Text style={styles.personalityText}>{trait}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    {selectedDog === dog.id && (
                      <View style={styles.selectedIndicator}>
                        <Heart size={16} color="white" strokeWidth={2} fill="white" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Step 3: Time Slot Selection */}
          {selectedDog && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Choose Your Time</Text>
              <Text style={styles.sectionSubtitle}>
                Available time slots for today
              </Text>
              <View style={styles.timeSlotGrid}>
                {timeSlots.map((timeSlot) => (
                  <TouchableOpacity
                    key={timeSlot}
                    style={[
                      styles.timeSlot,
                      selectedTimeSlot === timeSlot && styles.selectedTimeSlot
                    ]}
                    onPress={() => handleTimeSlotSelect(timeSlot)}
                    activeOpacity={0.7}
                  >
                    <Clock size={16} color={selectedTimeSlot === timeSlot ? 'white' : '#8EC6DB'} strokeWidth={2} />
                    <Text style={[
                      styles.timeSlotText,
                      selectedTimeSlot === timeSlot && styles.selectedTimeSlotText
                    ]}>
                      {timeSlot}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Booking Summary */}
          {selectedShelter && selectedDog && selectedTimeSlot && (
            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Booking Summary</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryItem}>
                  <MapPin size={20} color="#8EC6DB" strokeWidth={2} />
                  <View style={styles.summaryText}>
                    <Text style={styles.summaryLabel}>Shelter</Text>
                    <Text style={styles.summaryValue}>{selectedShelterData?.name}</Text>
                  </View>
                </View>
                <View style={styles.summaryItem}>
                  <Heart size={20} color="#F86F6F" strokeWidth={2} />
                  <View style={styles.summaryText}>
                    <Text style={styles.summaryLabel}>Dog</Text>
                    <Text style={styles.summaryValue}>{selectedDogData?.name} ({selectedDogData?.breed})</Text>
                  </View>
                </View>
                <View style={styles.summaryItem}>
                  <Calendar size={20} color="#7AC79E" strokeWidth={2} />
                  <View style={styles.summaryText}>
                    <Text style={styles.summaryLabel}>Time</Text>
                    <Text style={styles.summaryValue}>Today at {selectedTimeSlot}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.infoCard}>
                <Info size={16} color="#FBBF77" strokeWidth={2} />
                <Text style={styles.infoText}>
                  Both you and your match will receive confirmation details and the shelter's address once booked.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.bookButton}
                onPress={handleBookDate}
                activeOpacity={0.8}
              >
                <Text style={styles.bookButtonText}>Confirm Dog Date 🎉</Text>
              </TouchableOpacity>
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
    backgroundColor: '#FFF8F0',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 24,
    color: '#444B5A',
    flex: 1,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: '#444B5A',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
  },
  progressSection: {
    marginBottom: 32,
  },
  progressSteps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  progressStep: {
    alignItems: 'center',
    flex: 1,
  },
  activeStep: {
    opacity: 1,
  },
  progressStepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#B5C1B6',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 8,
  },
  progressStepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#444B5A',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  shelterList: {
    gap: 16,
  },
  shelterCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  selectedCard: {
    borderColor: '#F86F6F',
    backgroundColor: '#FFF8F0',
  },
  shelterImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  shelterInfo: {
    flex: 1,
  },
  shelterName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
    marginBottom: 4,
  },
  shelterDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shelterAddress: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#B5C1B6',
    marginLeft: 4,
    flex: 1,
  },
  shelterMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  shelterMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shelterRating: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#444B5A',
    marginLeft: 4,
  },
  shelterDogs: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#444B5A',
    marginLeft: 4,
  },
  shelterTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#444B5A',
    marginLeft: 4,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F86F6F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dogList: {
    gap: 16,
  },
  dogCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  dogImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  dogInfo: {
    flex: 1,
  },
  dogName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#444B5A',
    marginBottom: 4,
  },
  dogBreed: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  dogPersonality: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  personalityTag: {
    backgroundColor: '#8EC6DB',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  personalityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: 'white',
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#8EC6DB',
    minWidth: '30%',
    justifyContent: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#8EC6DB',
    borderColor: '#8EC6DB',
  },
  timeSlotText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#8EC6DB',
    marginLeft: 6,
  },
  selectedTimeSlotText: {
    color: 'white',
  },
  summarySection: {
    marginTop: 16,
  },
  summaryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#444B5A',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryText: {
    marginLeft: 12,
    flex: 1,
  },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  summaryValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#444B5A',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(251, 191, 119, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#444B5A',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  bookButton: {
    backgroundColor: '#F86F6F',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#F86F6F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bookButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 18,
  },
});