import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  StyleSheet,
  Image,
  Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: "This isn't just another dating app.",
    body: "PuppyLove brings people together through shared values — and a shared love for dogs. Here, you match based on personality, lifestyle, and how you'd enjoy a dog date together.",
    image: "https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg",
    gradient: ['#E8F5E8', '#F0F8FF', '#FFF8F0'],
  },
  {
    id: 2,
    title: "Every match comes with a dog.",
    body: "Swipe on adoptable dogs while answering playful compatibility questions. Based on your answers, you'll get 5 high-quality matches every 3 days — no swiping on people needed.",
    image: "https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg",
    gradient: ['#FFE4E1', '#FFF0F5', '#F0F8FF'],
  },
  {
    id: 3,
    title: "A real date — guaranteed in 5 days.",
    body: "Once you match, both of you have 24 hours to start chatting. Send at least 6 messages each per day for 3 days. Then, you'll get 2 days to book your first date — starting at a shelter with a dog you both like.",
    image: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg",
    gradient: ['#FFF8DC', '#FFFACD', '#F0F8FF'],
  },
  {
    id: 4,
    title: "Every user is verified.",
    body: "Before using the app, everyone completes a quick ID and face scan. It's how we keep the community safe, respectful, and real.",
    image: "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg",
    gradient: ['#F0F8FF', '#E6E6FA', '#FFF8F0'],
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / screenWidth);
    setCurrentIndex(index);
  };

  const handleGetStarted = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      router.replace('/(tabs)');
    });
  };

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === currentIndex ? '#F86F6F' : '#B5C1B6',
              width: index === currentIndex ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingData.map((item, index) => (
          <View key={item.id} style={styles.slide}>
            <LinearGradient
              colors={item.gradient}
              style={styles.gradientBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: item.image }}
                      style={styles.dogImage}
                      resizeMode="cover"
                    />
                    <View style={styles.imageOverlay}>
                      <Text style={styles.pawEmoji}>🐾</Text>
                    </View>
                  </View>

                  <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.body}>{item.body}</Text>
                  </View>

                  {index === onboardingData.length - 1 && (
                    <TouchableOpacity
                      style={styles.getStartedButton}
                      onPress={handleGetStarted}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.getStartedText}>Let's Get Started</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </SafeAreaView>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>

      {renderDots()}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    height: screenHeight,
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 120,
  },
  imageContainer: {
    height: screenHeight * 0.4,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  dogImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pawEmoji: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  title: {
    fontFamily: 'PlayfairDisplay-Bold',
    fontSize: 32,
    lineHeight: 40,
    color: '#444B5A',
    textAlign: 'center',
    marginBottom: 24,
  },
  body: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    lineHeight: 28,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  getStartedButton: {
    backgroundColor: '#F86F6F',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#F86F6F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  getStartedText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: 'white',
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#B5C1B6',
  },
});