import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MessageCircle, ArrowRight } from 'lucide-react-native';

export default function WaitingScreen() {
  const router = useRouter();
  const sniffAnim = useRef(new Animated.Value(0)).current;
  const pawAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate the dog sniffing motion
    const sniffAnimation = () => {
      Animated.sequence([
        Animated.timing(sniffAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(sniffAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => sniffAnimation());
    };

    // Animate the paw prints
    const pawAnimation = () => {
      Animated.sequence([
        Animated.timing(pawAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pawAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => pawAnimation());
    };

    sniffAnimation();
    pawAnimation();
  }, []);

  const handleContactSupport = () => {
    // In a real app, this would open support chat or email
    console.log('Contact support');
  };

  const handleContinue = () => {
    // For demo purposes, navigate to main app
    router.replace('/(tabs)');
  };

  const sniffTransform = sniffAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const pawOpacity = pawAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  return (
    <LinearGradient
      colors={['#E8F5E8', '#F0F8FF', '#FFF8F0']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.animationContainer}>
            <Animated.View 
              style={[
                styles.dogContainer,
                { transform: [{ translateY: sniffTransform }] }
              ]}
            >
              <Text style={styles.dogEmoji}>🐕‍🦺</Text>
              <Text style={styles.passportEmoji}>📄</Text>
            </Animated.View>
            
            <View style={styles.pawTrail}>
              <Animated.Text style={[styles.pawPrint, { opacity: pawOpacity }]}>
                🐾
              </Animated.Text>
              <Animated.Text style={[styles.pawPrint, { opacity: pawOpacity, transform: [{ scale: 0.8 }] }]}>
                🐾
              </Animated.Text>
              <Animated.Text style={[styles.pawPrint, { opacity: pawOpacity, transform: [{ scale: 0.6 }] }]}>
                🐾
              </Animated.Text>
            </View>
          </View>

          <Text style={styles.title}>You're Almost In!</Text>
          
          <Text style={styles.subtitle}>
            Our team is giving your info a quick sniff 🐾
            This usually takes under 10 minutes. Hang tight — you're one pawstep away from joining the PuppyLove pack!
          </Text>

          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <View style={styles.statusIndicator}>
                <View style={styles.pulsingDot} />
                <Text style={styles.statusText}>Verification in progress...</Text>
              </View>
            </View>
            
            <Text style={styles.estimateText}>
              ⏱️ Usually takes 5-10 minutes
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.supportButton}
              onPress={handleContactSupport}
              activeOpacity={0.7}
            >
              <MessageCircle size={20} color="#8EC6DB" strokeWidth={2} />
              <Text style={styles.supportButtonText}>Still waiting? Contact Support</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue (Demo)</Text>
              <ArrowRight size={20} color="white" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.trustBadges}>
            <View style={styles.trustBadge}>
              <Text style={styles.trustEmoji}>🔒</Text>
              <Text style={styles.trustText}>Secure</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustEmoji}>⚡</Text>
              <Text style={styles.trustText}>Fast</Text>
            </View>
            <View style={styles.trustBadge}>
              <Text style={styles.trustEmoji}>✅</Text>
              <Text style={styles.trustText}>Verified</Text>
            </View>
          </View>
        </View>
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  animationContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  dogContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dogEmoji: {
    fontSize: 64,
    marginRight: 16,
  },
  passportEmoji: {
    fontSize: 32,
  },
  pawTrail: {
    flexDirection: 'row',
    gap: 12,
  },
  pawPrint: {
    fontSize: 24,
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
    marginBottom: 32,
  },
  statusCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  statusHeader: {
    marginBottom: 12,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pulsingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FBBF77',
    marginRight: 8,
  },
  statusText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
  },
  estimateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  actionButtons: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'center',
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
  trustBadges: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  trustBadge: {
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