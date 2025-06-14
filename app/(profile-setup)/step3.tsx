import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronLeft, Heart } from 'lucide-react-native';
import { useProfile } from '@/hooks/useProfile';

export default function ProfileSetupStep3() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  const [dreamDateBio, setDreamDateBio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile?.bio) {
      setDreamDateBio(profile.bio);
    }
  }, [profile]);

  const handleSaveAndNext = async () => {
    if (dreamDateBio.trim().length < 50) {
      Alert.alert(
        'More Details Needed', 
        'Please write at least 50 characters to help others understand your ideal date!'
      );
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ bio: dreamDateBio.trim() });
      router.push('/(profile-setup)/step4');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to save your dream date description. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const exampleTexts = [
    "We'd meet at the shelter, pick a pup, then head to a dog café and share treats while getting to know each other.",
    "A morning walk through the park with a playful dog, followed by brunch and lots of laughs.",
    "Visiting a dog beach, watching our furry friend play in the waves while we chat about life and dreams.",
  ];

  return (
    <LinearGradient
      colors={['#FFF8DC', '#FFFACD', '#F0F8FF']}
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
              <View style={[styles.progressFill, { width: '60%' }]} />
            </View>
            <Text style={styles.stepText}>Step 3 of 5</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.titleSection}>
              <View style={styles.iconContainer}>
                <Heart size={32} color="#FBBF77" strokeWidth={2} />
              </View>
              <Text style={styles.title}>Describe Your Dream Date</Text>
              <Text style={styles.subtitle}>
                Paint a picture of your perfect first date involving dogs. Be specific and authentic!
              </Text>
            </View>

            <View style={styles.inputSection}>
              <TextInput
                style={styles.bioInput}
                placeholder="We'd meet at the shelter, pick a pup, then head to a dog café and share treats while getting to know each other..."
                value={dreamDateBio}
                onChangeText={setDreamDateBio}
                multiline
                maxLength={300}
                placeholderTextColor="#B5C1B6"
                textAlignVertical="top"
              />
              <View style={styles.inputFooter}>
                <Text style={[
                  styles.charCount,
                  dreamDateBio.length < 50 && styles.charCountWarning
                ]}>
                  {dreamDateBio.length}/300 characters
                </Text>
                <Text style={styles.minRequirement}>
                  (minimum 50 characters)
                </Text>
              </View>
            </View>

            <View style={styles.inspirationSection}>
              <Text style={styles.inspirationTitle}>Need inspiration? Try these ideas:</Text>
              <View style={styles.exampleCards}>
                {exampleTexts.map((example, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.exampleCard}
                    onPress={() => setDreamDateBio(example)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.exampleText}>"{example}"</Text>
                    <Text style={styles.useThisText}>Tap to use this</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.encouragementCard}>
              <Text style={styles.encouragementText}>
                🐾 This helps potential matches imagine spending time with you and a furry friend!
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                (dreamDateBio.trim().length < 50 || saving) && styles.buttonDisabled
              ]}
              onPress={handleSaveAndNext}
              disabled={dreamDateBio.trim().length < 50 || saving}
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
  inputSection: {
    marginBottom: 32,
  },
  bioInput: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    color: '#444B5A',
    minHeight: 120,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#7AC79E',
  },
  charCountWarning: {
    color: '#F86F6F',
  },
  minRequirement: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#B5C1B6',
  },
  inspirationSection: {
    marginBottom: 32,
  },
  inspirationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
    marginBottom: 16,
    textAlign: 'center',
  },
  exampleCards: {
    gap: 12,
  },
  exampleCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exampleText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#444B5A',
    lineHeight: 20,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  useThisText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#FBBF77',
  },
  encouragementCard: {
    backgroundColor: 'rgba(251, 191, 119, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#FBBF77',
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