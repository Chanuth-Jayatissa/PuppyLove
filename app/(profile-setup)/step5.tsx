import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check, Info } from 'lucide-react-native';

export default function ProfileSetupStep5() {
  const router = useRouter();
  const [hasDog, setHasDog] = useState<string>('');
  const [isVolunteer, setIsVolunteer] = useState(false);
  const [consideringAdoption, setConsideringAdoption] = useState(false);
  const [preferredEnergy, setPreferredEnergy] = useState('');
  const [preferredSize, setPreferredSize] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSaveAndNext = async () => {
    if (!hasDog || !preferredEnergy || !preferredSize) {
      Alert.alert(
        'Complete Required Fields', 
        'Please answer all required questions to continue.'
      );
      return;
    }

    setSaving(true);
    try {
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/(profile-setup)/completion');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to save your preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const dogOwnershipOptions = ['Yes', 'No', 'Sometimes'];
  const energyOptions = ['Low', 'Medium', 'High', 'Any'];
  const sizeOptions = ['Small', 'Medium', 'Large', 'Any'];

  return (
    <LinearGradient
      colors={['#E8F5E8', '#F0F8FF', '#FFF8F0']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#444B5A" strokeWidth={2} />
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
            <Text style={styles.stepText}>Step 5 of 5</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.titleSection}>
              <View style={styles.iconContainer}>
                <Info size={32} color="#7AC79E" strokeWidth={2} />
              </View>
              <Text style={styles.title}>A Few More Details</Text>
              <Text style={styles.subtitle}>
                Help us understand your dog situation and preferences
              </Text>
            </View>

            {/* Dog Ownership */}
            <View style={styles.questionSection}>
              <Text style={styles.questionTitle}>Do you have a dog? *</Text>
              <View style={styles.radioGroup}>
                {dogOwnershipOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.radioOption}
                    onPress={() => setHasDog(option)}
                    activeOpacity={0.7}
                  >
                    <View style={[
                      styles.radioCircle,
                      hasDog === option && styles.radioSelected
                    ]}>
                      {hasDog === option && <View style={styles.radioDot} />}
                    </View>
                    <Text style={styles.radioText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Volunteer & Adoption */}
            <View style={styles.questionSection}>
              <Text style={styles.questionTitle}>Your involvement with dogs:</Text>
              <View style={styles.checkboxGroup}>
                <TouchableOpacity 
                  style={styles.checkboxOption}
                  onPress={() => setIsVolunteer(!isVolunteer)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.checkbox,
                    isVolunteer && styles.checkboxSelected
                  ]}>
                    {isVolunteer && <Check size={12} color="white" strokeWidth={2} />}
                  </View>
                  <Text style={styles.checkboxText}>I volunteer at shelters</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.checkboxOption}
                  onPress={() => setConsideringAdoption(!consideringAdoption)}
                  activeOpacity={0.7}
                >
                  <View style={[
                    styles.checkbox,
                    consideringAdoption && styles.checkboxSelected
                  ]}>
                    {consideringAdoption && <Check size={12} color="white" strokeWidth={2} />}
                  </View>
                  <Text style={styles.checkboxText}>I'm considering adoption</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Dog Preferences */}
            <View style={styles.questionSection}>
              <Text style={styles.questionTitle}>Preferred dog energy level: *</Text>
              <View style={styles.preferenceOptions}>
                {energyOptions.map((energy) => (
                  <TouchableOpacity
                    key={energy}
                    style={[
                      styles.preferenceOption,
                      preferredEnergy === energy && styles.selectedPreference
                    ]}
                    onPress={() => setPreferredEnergy(energy)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.preferenceText,
                      preferredEnergy === energy && styles.selectedPreferenceText
                    ]}>
                      {energy}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.questionSection}>
              <Text style={styles.questionTitle}>Preferred dog size: *</Text>
              <View style={styles.preferenceOptions}>
                {sizeOptions.map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.preferenceOption,
                      preferredSize === size && styles.selectedPreference
                    ]}
                    onPress={() => setPreferredSize(size)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.preferenceText,
                      preferredSize === size && styles.selectedPreferenceText
                    ]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.encouragementCard}>
              <Text style={styles.encouragementText}>
                🐾 Almost done! These preferences help us suggest the perfect dogs for your dates.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                (!hasDog || !preferredEnergy || !preferredSize || saving) && styles.buttonDisabled
              ]}
              onPress={handleSaveAndNext}
              disabled={!hasDog || !preferredEnergy || !preferredSize || saving}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Save & Next'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 16,
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
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F86F6F',
    borderRadius: 2,
  },
  stepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  questionSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  questionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
    marginBottom: 16,
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioSelected: {
    borderColor: '#7AC79E',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7AC79E',
  },
  radioText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#444B5A',
  },
  checkboxGroup: {
    gap: 16,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#7AC79E',
    borderColor: '#7AC79E',
  },
  checkboxText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#444B5A',
  },
  preferenceOptions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  preferenceOption: {
    flex: 1,
    minWidth: '22%',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPreference: {
    backgroundColor: '#7AC79E',
    borderColor: '#7AC79E',
  },
  preferenceText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#444B5A',
    textAlign: 'center',
  },
  selectedPreferenceText: {
    color: 'white',
  },
  encouragementCard: {
    backgroundColor: 'rgba(122, 199, 158, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#7AC79E',
  },
  encouragementText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#444B5A',
    lineHeight: 20,
    textAlign: 'center',
  },
  saveButton: {
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
  buttonDisabled: {
    backgroundColor: '#B5C1B6',
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 18,
  },
});