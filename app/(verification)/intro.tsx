import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Shield, Users, Lock, CircleCheck as CheckCircle } from 'lucide-react-native';

export default function VerificationIntroScreen() {
  const router = useRouter();

  const benefits = [
    {
      icon: Users,
      title: 'Real People Only',
      description: 'No bots, catfish, or fake profiles'
    },
    {
      icon: Lock,
      title: 'Your Data is Safe',
      description: 'Bank-level encryption protects your information'
    },
    {
      icon: CheckCircle,
      title: 'Trusted Community',
      description: 'Everyone is verified before joining'
    }
  ];

  const handleSkipForTesting = () => {
    router.replace('/(profile-setup)/step1');
  };

  return (
    <LinearGradient
      colors={['#E8F5E8', '#F0F8FF', '#FFF8F0']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Testing Notice */}
            <View style={styles.testingNotice}>
              <Text style={styles.testingText}>
                🧪 Testing Mode: You can skip verification or go through the demo flow
              </Text>
            </View>

            <View style={styles.heroSection}>
              <View style={styles.iconContainer}>
                <Shield size={48} color="#7AC79E" strokeWidth={2} />
              </View>
              
              <Text style={styles.title}>Let's Keep PuppyLove Safe</Text>
              
              <Text style={styles.subtitle}>
                Before joining our community, all users complete a quick identity check.
                This helps prevent bots, catfishing, and unsafe behavior — so you can connect with real people who care.
              </Text>

              <Image
                source={{ uri: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg' }}
                style={styles.heroImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsTitle}>Why We Verify</Text>
              
              {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <View style={styles.benefitIcon}>
                    <benefit.icon size={24} color="#8EC6DB" strokeWidth={2} />
                  </View>
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                    <Text style={styles.benefitDescription}>{benefit.description}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.processPreview}>
              <Text style={styles.processTitle}>Quick & Simple Process</Text>
              <View style={styles.processSteps}>
                <View style={styles.processStep}>
                  <Text style={styles.stepNumber}>1</Text>
                  <Text style={styles.stepText}>ID Photo</Text>
                </View>
                <View style={styles.processConnector} />
                <View style={styles.processStep}>
                  <Text style={styles.stepNumber}>2</Text>
                  <Text style={styles.stepText}>Quick Selfie</Text>
                </View>
                <View style={styles.processConnector} />
                <View style={styles.processStep}>
                  <Text style={styles.stepNumber}>3</Text>
                  <Text style={styles.stepText}>Review</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.startButton}
              onPress={() => router.push('/(verification)/id-scan')}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>Start Verification</Text>
            </TouchableOpacity>

            <Text style={styles.timeEstimate}>
              ⏱️ Takes less than 2 minutes
            </Text>

            {/* Testing Skip Button */}
            <View style={styles.testingSection}>
              <TouchableOpacity
                style={styles.skipButton}
                onPress={handleSkipForTesting}
                activeOpacity={0.7}
              >
                <Text style={styles.skipButtonText}>Skip Verification (Testing)</Text>
              </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  testingNotice: {
    backgroundColor: '#FBBF77',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  testingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#444B5A',
    textAlign: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
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
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 36,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  benefitsSection: {
    marginBottom: 32,
  },
  benefitsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#444B5A',
    marginBottom: 20,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  benefitIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
    marginBottom: 4,
  },
  benefitDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  processPreview: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  processTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
    textAlign: 'center',
    marginBottom: 20,
  },
  processSteps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  processStep: {
    alignItems: 'center',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8EC6DB',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 8,
  },
  stepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  processConnector: {
    width: 40,
    height: 2,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 8,
  },
  startButton: {
    backgroundColor: '#F86F6F',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#F86F6F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 18,
  },
  timeEstimate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  testingSection: {
    alignItems: 'center',
  },
  skipButton: {
    backgroundColor: '#B5C1B6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: 'white',
  },
});