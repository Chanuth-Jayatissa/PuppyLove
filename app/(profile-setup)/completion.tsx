import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Animated,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, Heart } from 'lucide-react-native';

export default function ProfileCompletionScreen() {
  const router = useRouter();
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Bouncing heart animation
    const bounce = () => {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => bounce());
    };
    bounce();
  }, []);

  const handleFinishProfile = () => {
    router.replace('/(tabs)/explore');
  };

  const bounceTransform = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

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
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }
            ]}
          >
            <View style={styles.celebrationSection}>
              <Animated.View 
                style={[
                  styles.iconContainer,
                  { transform: [{ translateY: bounceTransform }] }
                ]}
              >
                <Heart size={64} color="#F86F6F" strokeWidth={2} fill="#F86F6F" />
              </Animated.View>
              
              <Text style={styles.title}>You're All Set!</Text>
              <Text style={styles.subtitle}>
                Welcome to the PuppyLove pack! Your profile is complete and you're ready to start making meaningful connections.
              </Text>

              <View style={styles.achievementCard}>
                <Text style={styles.achievementTitle}>🎉 Profile Complete!</Text>
                <View style={styles.achievementList}>
                  <View style={styles.achievementItem}>
                    <Text style={styles.checkmark}>✅</Text>
                    <Text style={styles.achievementText}>Dog avatar selected</Text>
                  </View>
                  <View style={styles.achievementItem}>
                    <Text style={styles.checkmark}>✅</Text>
                    <Text style={styles.achievementText}>Personality prompts answered</Text>
                  </View>
                  <View style={styles.achievementItem}>
                    <Text style={styles.checkmark}>✅</Text>
                    <Text style={styles.achievementText}>Dream date described</Text>
                  </View>
                  <View style={styles.achievementItem}>
                    <Text style={styles.checkmark}>✅</Text>
                    <Text style={styles.achievementText}>Values & lifestyle tagged</Text>
                  </View>
                  <View style={styles.achievementItem}>
                    <Text style={styles.checkmark}>✅</Text>
                    <Text style={styles.achievementText}>Dog preferences set</Text>
                  </View>
                </View>
              </View>

              <View style={styles.nextStepsCard}>
                <Text style={styles.nextStepsTitle}>What happens next?</Text>
                <View style={styles.stepsList}>
                  <View style={styles.step}>
                    <Text style={styles.stepNumber}>1</Text>
                    <Text style={styles.stepText}>Explore adoptable dogs and answer fun compatibility questions</Text>
                  </View>
                  <View style={styles.step}>
                    <Text style={styles.stepNumber}>2</Text>
                    <Text style={styles.stepText}>Get 5 high-quality matches every 3 days based on your answers</Text>
                  </View>
                  <View style={styles.step}>
                    <Text style={styles.stepNumber}>3</Text>
                    <Text style={styles.stepText}>Chat with matches and plan your first dog date at a shelter!</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.finishButton}
                onPress={handleFinishProfile}
                activeOpacity={0.8}
              >
                <Text style={styles.finishButtonText}>Start Exploring Dogs</Text>
                <ArrowRight size={20} color="white" strokeWidth={2} />
              </TouchableOpacity>

              <View style={styles.welcomeMessage}>
                <Text style={styles.welcomeText}>
                  🐾 Ready to find your perfect match through the love of dogs? Let's go!
                </Text>
              </View>
            </View>
          </Animated.View>
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
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  content: {
    alignItems: 'center',
  },
  celebrationSection: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 32,
    color: '#444B5A',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#6B7280',
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 32,
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  achievementTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#444B5A',
    textAlign: 'center',
    marginBottom: 20,
  },
  achievementList: {
    gap: 12,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 16,
    marginRight: 12,
  },
  achievementText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#444B5A',
    flex: 1,
  },
  nextStepsCard: {
    backgroundColor: 'rgba(122, 199, 158, 0.1)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#7AC79E',
  },
  nextStepsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
    marginBottom: 16,
    textAlign: 'center',
  },
  stepsList: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#7AC79E',
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 24,
    marginRight: 12,
  },
  stepText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#444B5A',
    lineHeight: 20,
    flex: 1,
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F86F6F',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 32,
    marginBottom: 24,
    shadowColor: '#F86F6F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    width: '100%',
  },
  finishButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 18,
    marginRight: 8,
  },
  welcomeMessage: {
    backgroundColor: 'rgba(248, 111, 111, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F86F6F',
    width: '100%',
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#444B5A',
    lineHeight: 24,
    textAlign: 'center',
  },
});