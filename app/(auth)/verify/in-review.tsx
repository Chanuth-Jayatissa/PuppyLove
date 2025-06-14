import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Clock, CheckCircle, MessageCircle, ArrowRight } from 'lucide-react-native';

export default function InReviewScreen() {
  const router = useRouter();
  const [timeRemaining, setTimeRemaining] = useState(8 * 60 + 45); // 8 minutes 45 seconds
  const [isVerified, setIsVerified] = useState(false);
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    // Animate the pulse effect
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();

    // Countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsVerified(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate verification completion after 10 seconds for demo
    const verificationTimer = setTimeout(() => {
      setIsVerified(true);
    }, 10000);

    return () => {
      clearInterval(timer);
      clearTimeout(verificationTimer);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContinue = () => {
    // Navigate to main app since verification is complete
    router.replace('/(tabs)');
  };

  const handleContactSupport = () => {
    // In a real app, this would open support chat or email
    router.push('/(auth)/verify/waiting');
  };

  if (isVerified) {
    return (
      <LinearGradient
        colors={['#E8F5E8', '#F0F8FF', '#FFF8F0']}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            <Animated.View 
              style={[
                styles.successIcon,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <CheckCircle size={64} color="#7AC79E" strokeWidth={2} />
            </Animated.View>

            <Text style={styles.successTitle}>Verification Complete!</Text>
            <Text style={styles.successSubtitle}>
              Welcome to PuppyLove! Your identity has been verified and you're ready to start matching.
            </Text>

            <View style={styles.welcomeCard}>
              <Text style={styles.welcomeText}>
                🎉 You're now part of our verified community of dog lovers!
              </Text>
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Start Matching</Text>
              <ArrowRight size={20} color="white" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={['#FFF8DC', '#FFFACD', '#F0F8FF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '100%' }]} />
            </View>
            <Text style={styles.stepText}>Step 3 of 3</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Animated.View 
              style={[
                styles.iconContainer,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <Clock size={48} color="#FBBF77" strokeWidth={2} />
            </Animated.View>

            <Text style={styles.title}>We're Reviewing Your Info</Text>
            <Text style={styles.subtitle}>
              Your verification is in progress — this usually takes less than 10 minutes.
              You'll get a notification as soon as it's complete.
            </Text>

            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Text style={styles.statusTitle}>Verification Status</Text>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>In Progress</Text>
                </View>
              </View>

              <View style={styles.statusSteps}>
                <View style={styles.statusStep}>
                  <CheckCircle size={20} color="#7AC79E" strokeWidth={2} />
                  <Text style={styles.statusStepText}>ID uploaded</Text>
                </View>
                <View style={styles.statusStep}>
                  <CheckCircle size={20} color="#7AC79E" strokeWidth={2} />
                  <Text style={styles.statusStepText}>Video recorded</Text>
                </View>
                <View style={styles.statusStep}>
                  <Clock size={20} color="#FBBF77" strokeWidth={2} />
                  <Text style={styles.statusStepText}>Under review</Text>
                </View>
              </View>

              <View style={styles.timeEstimate}>
                <Text style={styles.timeEstimateText}>
                  Estimated completion: {formatTime(timeRemaining)}
                </Text>
              </View>
            </View>

            <View style={styles.whileWaitingCard}>
              <Text style={styles.whileWaitingTitle}>While You Wait</Text>
              <Text style={styles.whileWaitingText}>
                Our team is carefully reviewing your information to ensure the safety and authenticity of our community. 
                This process helps maintain the trust that makes PuppyLove special.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.supportButton}
              onPress={handleContactSupport}
              activeOpacity={0.7}
            >
              <MessageCircle size={20} color="#8EC6DB" strokeWidth={2} />
              <Text style={styles.supportButtonText}>Something wrong? Contact Support</Text>
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
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 16,
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
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
  successIcon: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 28,
    color: '#444B5A',
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 36,
  },
  successTitle: {
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
    marginBottom: 32,
  },
  successSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8DC',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FBBF77',
    marginRight: 6,
  },
  statusText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#444B5A',
  },
  statusSteps: {
    gap: 12,
    marginBottom: 16,
  },
  statusStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusStepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#444B5A',
    marginLeft: 12,
  },
  timeEstimate: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  timeEstimateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  whileWaitingCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#8EC6DB',
  },
  whileWaitingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
    marginBottom: 8,
  },
  whileWaitingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  welcomeCard: {
    backgroundColor: 'rgba(122, 199, 158, 0.1)',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 32,
    alignItems: 'center',
  },
  welcomeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
    textAlign: 'center',
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  supportButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8EC6DB',
    marginLeft: 8,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F86F6F',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    shadowColor: '#F86F6F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 18,
    marginRight: 8,
  },
});