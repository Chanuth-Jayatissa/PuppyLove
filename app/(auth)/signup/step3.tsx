import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Shield, Camera, CreditCard } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function SignupStep3Screen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { firstName, email, password, city, gender, lookingFor } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);

  const handleVerifyIdentity = async () => {
    setLoading(true);
    try {
      // Create the account first
      await signUp(
        email as string, 
        password as string, 
        firstName as string
      );
      
      // Navigate to verification flow
      router.push('/(auth)/verify/intro');
    } catch (error: any) {
      // Check if the error is due to user already existing
      if (error.message?.includes('User already registered') || 
          error.message?.includes('user_already_exists')) {
        Alert.alert(
          'Account Already Exists',
          'An account with this email address already exists. Would you like to sign in instead?',
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Sign In',
              onPress: () => router.push('/(auth)/sign-in')
            }
          ]
        );
      } else {
        Alert.alert('Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#F0F8FF', '#E6E6FA', '#FFF8F0']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
              <Text style={styles.stepText}>Step 3 of 3</Text>
            </View>
          </View>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Shield size={48} color="#7AC79E" strokeWidth={2} />
            </View>

            <Text style={styles.title}>For Everyone's Safety</Text>
            <Text style={styles.subtitle}>
              Before you start matching, we'll verify your identity with:
            </Text>

            <View style={styles.verificationSteps}>
              <View style={styles.verificationStep}>
                <View style={styles.stepIcon}>
                  <CreditCard size={24} color="#8EC6DB" strokeWidth={2} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Government-issued ID scan</Text>
                  <Text style={styles.stepDescription}>
                    Quick photo of your driver's license or passport
                  </Text>
                </View>
              </View>

              <View style={styles.verificationStep}>
                <View style={styles.stepIcon}>
                  <Camera size={24} color="#FBBF77" strokeWidth={2} />
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Quick selfie video</Text>
                  <Text style={styles.stepDescription}>
                    A short video to confirm you're a real person
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.safetyNote}>
              <Text style={styles.safetyText}>
                This helps keep the PuppyLove community real, respectful, and safe. 
                Your verification data is encrypted and never shared with other users.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.verifyButton, loading && styles.buttonDisabled]}
              onPress={handleVerifyIdentity}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.verifyButtonText}>
                {loading ? 'Creating Account...' : "I'm Ready to Verify"}
              </Text>
            </TouchableOpacity>

            <View style={styles.trustIndicators}>
              <View style={styles.trustItem}>
                <Text style={styles.trustEmoji}>🔒</Text>
                <Text style={styles.trustText}>Bank-level encryption</Text>
              </View>
              <View style={styles.trustItem}>
                <Text style={styles.trustEmoji}>🛡️</Text>
                <Text style={styles.trustText}>Privacy protected</Text>
              </View>
              <View style={styles.trustItem}>
                <Text style={styles.trustEmoji}>✅</Text>
                <Text style={styles.trustText}>Verified community</Text>
              </View>
            </View>
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
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
  content: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
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
    marginBottom: 32,
    textAlign: 'center',
  },
  verificationSteps: {
    width: '100%',
    marginBottom: 32,
  },
  verificationStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
    marginBottom: 4,
  },
  stepDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  safetyNote: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#7AC79E',
  },
  safetyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#444B5A',
    lineHeight: 20,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: '#F86F6F',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#F86F6F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    minWidth: 200,
  },
  buttonDisabled: {
    backgroundColor: '#B5C1B6',
  },
  verifyButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 18,
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  trustItem: {
    alignItems: 'center',
    flex: 1,
  },
  trustEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  trustText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
});