import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, PanResponder, Animated, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, X, ChevronDown, MapPin, Sparkles } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const mockDogs = [
  {
    id: 1,
    name: 'Buddy',
    age: '2 y/o',
    breed: 'Golden Retriever',
    size: 'Large',
    distance: '3 miles away',
    energyLevel: 'Playful Explorer',
    images: [
      'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg',
      'https://images.pexels.com/photos/160846/french-bulldog-summer-smile-joy-160846.jpeg',
      'https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg'
    ],
    temperamentTags: [
      { icon: '🧸', label: 'Lap Dog' },
      { icon: '🐾', label: 'Friendly' },
      { icon: '⚡', label: 'High Energy' }
    ],
    funFact: 'Loves chasing squeaky toys 🎾 and soft snuggles 💕',
    fullProfile: {
      thingsILove: ['Long walks in the park', 'Playing fetch', 'Meeting new friends'],
      stillLearning: ['Walking on a leash', 'Not jumping on visitors'],
      idealDay: 'A morning hike followed by a nap in the sunshine'
    }
  },
  {
    id: 2,
    name: 'Luna',
    age: '1.5 y/o',
    breed: 'Border Collie',
    size: 'Medium',
    distance: '2 miles away',
    energyLevel: 'High-Octane',
    images: [
      'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
      'https://images.pexels.com/photos/97082/pexels-photo-97082.jpeg',
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg'
    ],
    temperamentTags: [
      { icon: '🧠', label: 'Smart Cookie' },
      { icon: '💝', label: 'Gentle Soul' },
      { icon: '🎾', label: 'Loves Fetch' }
    ],
    funFact: 'Can solve puzzle toys in under 5 minutes! 🧩✨',
    fullProfile: {
      thingsILove: ['Mental challenges', 'Agility courses', 'Learning new tricks'],
      stillLearning: ['Patience during grooming', 'Sharing toys'],
      idealDay: 'Brain games in the morning, then a challenging hike'
    }
  },
  {
    id: 3,
    name: 'Bella',
    age: '4 y/o',
    breed: 'Beagle',
    size: 'Medium',
    distance: '5 miles away',
    energyLevel: 'Chill Companion',
    images: [
      'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg',
      'https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg',
      'https://images.pexels.com/photos/1562983/pexels-photo-1562983.jpeg'
    ],
    temperamentTags: [
      { icon: '🌿', label: 'Nature-Loving' },
      { icon: '🌅', label: 'Morning Person' },
      { icon: '💆', label: 'Gentle Soul' }
    ],
    funFact: 'Champion nap-taker and treat connoisseur! 😴🍪',
    fullProfile: {
      thingsILove: ['Sniffing adventures', 'Cozy blankets', 'Gentle pets'],
      stillLearning: ['Coming when called during exciting smells'],
      idealDay: 'A leisurely sniff walk followed by a cozy afternoon nap'
    }
  }
];

const quizQuestions = [
  {
    id: 'q1',
    question: 'Pick your perfect dog day:',
    options: ['Park Adventure', 'Beach Walk', 'Dog Café', 'Couch Cuddles'],
  },
  {
    id: 'q2',
    question: 'Your ideal dog energy level:',
    options: ['High Energy', 'Moderate', 'Calm & Gentle', 'Varies by Mood'],
  },
];

export default function ExploreScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [exploredCount, setExploredCount] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(0);
  const [expandedCard, setExpandedCard] = useState(false);

  const pan = new Animated.ValueXY();
  const rotate = pan.x.interpolate({
    inputRange: [-screenWidth / 2, 0, screenWidth / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 120) {
        swipeRight();
      } else if (gestureState.dx < -120) {
        swipeLeft();
      } else {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const swipeRight = () => {
    Animated.timing(pan, {
      toValue: { x: screenWidth, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      nextCard();
    });
  };

  const swipeLeft = () => {
    Animated.timing(pan, {
      toValue: { x: -screenWidth, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      nextCard();
    });
  };

  const nextCard = () => {
    pan.setValue({ x: 0, y: 0 });
    setImageIndex(0);
    setExpandedCard(false);
    setExploredCount(prev => prev + 1);
    
    if ((exploredCount + 1) % 3 === 0) {
      setShowQuiz(true);
    } else {
      setCurrentIndex((prev) => (prev + 1) % mockDogs.length);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    setQuizAnswered(prev => prev + 1);
    setShowQuiz(false);
    setCurrentQuiz((prev) => (prev + 1) % quizQuestions.length);
    setCurrentIndex((prev) => (prev + 1) % mockDogs.length);
  };

  const cycleImage = () => {
    const currentDog = mockDogs[currentIndex];
    setImageIndex((prev) => (prev + 1) % currentDog.images.length);
  };

  const getEnergyTintColor = (energyLevel: string) => {
    switch (energyLevel) {
      case 'Chill Companion':
        return 'rgba(181, 193, 182, 0.15)'; // Sage Gray overlay
      case 'Playful Explorer':
        return 'rgba(251, 191, 119, 0.15)'; // Golden Apricot overlay
      case 'High-Octane':
        return 'rgba(248, 111, 111, 0.15)'; // Warm Coral overlay
      default:
        return 'rgba(142, 198, 219, 0.15)'; // Default blue overlay
    }
  };

  const getSizeIcon = (size: string) => {
    switch (size) {
      case 'Small': return '🐕‍🦺';
      case 'Medium': return '🐕';
      case 'Large': return '🦮';
      default: return '🐶';
    }
  };

  if (exploredCount >= 15) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore Dog Vibes</Text>
          <View style={styles.progressTracker}>
            <Text style={styles.progressText}>
              🐾 You've explored {exploredCount} dogs · Answered {quizAnswered} quiz questions
            </Text>
          </View>
        </View>
        <View style={styles.completionCard}>
          <Text style={styles.completionTitle}>You've explored today's dogs!</Text>
          <Text style={styles.completionSubtitle}>
            Max the Maltese says see you tomorrow 🐶
          </Text>
          <Text style={styles.countdown}>Next pups arrive in: 12h 34m</Text>
          <TouchableOpacity style={styles.completionButton}>
            <Text style={styles.completionButtonText}>See Your Matches So Far</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (showQuiz) {
    const question = quizQuestions[currentQuiz];
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Explore Dog Vibes</Text>
          <View style={styles.progressTracker}>
            <Text style={styles.progressText}>
              🐾 You've explored {exploredCount} dogs · Answered {quizAnswered} quiz questions
            </Text>
          </View>
        </View>

        <View style={styles.quizCard}>
          <Text style={styles.quizQuestion}>{question.question}</Text>
          <View style={styles.quizOptions}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quizOption}
                onPress={() => handleQuizAnswer(option)}
                activeOpacity={0.7}
              >
                <Text style={styles.quizOptionText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.quizNote}>Your answers help us find better matches 🐾</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentDog = mockDogs[currentIndex];

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Dog Vibes</Text>
        <View style={styles.progressTracker}>
          <Text style={styles.progressText}>
            🐾 You've explored {exploredCount} dogs · Answered {quizAnswered} quiz questions
          </Text>
        </View>
      </View>

      {/* Dog Card Container */}
      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.card,
            { backgroundColor: getEnergyTintColor(currentDog.energyLevel) },
            {
              transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Image Section */}
          <TouchableOpacity onPress={cycleImage} style={styles.imageSection}>
            <Image source={{ uri: currentDog.images[imageIndex] }} style={styles.dogImage} />
            
            {/* Overlay Badges */}
            <View style={styles.overlayBadges}>
              <View style={styles.energyBadge}>
                <Text style={styles.energyBadgeText}>{currentDog.energyLevel}</Text>
              </View>
              <View style={styles.distanceBadge}>
                <MapPin size={12} color="#B5C1B6" strokeWidth={2} />
                <Text style={styles.distanceBadgeText}>{currentDog.distance}</Text>
              </View>
            </View>

            {/* Image Pagination Dots */}
            <View style={styles.imageIndicators}>
              {currentDog.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    { backgroundColor: index === imageIndex ? '#F86F6F' : 'rgba(255, 255, 255, 0.5)' }
                  ]}
                />
              ))}
            </View>
          </TouchableOpacity>

          {/* Content Section */}
          <View style={styles.contentSection}>
            {/* Dog Identity */}
            <View style={styles.dogIdentity}>
              <Text style={styles.dogName}>
                {currentDog.name} • {currentDog.age} • {currentDog.breed}
              </Text>
              <View style={styles.sizeTag}>
                <Text style={styles.sizeIcon}>{getSizeIcon(currentDog.size)}</Text>
                <Text style={styles.sizeText}>{currentDog.size}</Text>
              </View>
            </View>

            {/* Temperament Tags */}
            <View style={styles.temperamentTags}>
              {currentDog.temperamentTags.map((tag, index) => (
                <View key={index} style={styles.temperamentTag}>
                  <Text style={styles.temperamentIcon}>{tag.icon}</Text>
                  <Text style={styles.temperamentText}>{tag.label}</Text>
                </View>
              ))}
            </View>

            {/* Fun Fact */}
            <View style={styles.funFactContainer}>
              <Text style={styles.funFact}>"{currentDog.funFact}"</Text>
            </View>

            {/* Expandable Section */}
            <TouchableOpacity 
              style={styles.expandButton}
              onPress={() => setExpandedCard(!expandedCard)}
              activeOpacity={0.7}
            >
              <Text style={styles.expandText}>More About {currentDog.name}</Text>
              <ChevronDown 
                size={16} 
                color="#8EC6DB" 
                strokeWidth={2}
                style={[
                  styles.expandIcon,
                  expandedCard && { transform: [{ rotate: '180deg' }] }
                ]}
              />
            </TouchableOpacity>

            {/* Expanded Content */}
            {expandedCard && (
              <ScrollView style={styles.expandedContent} showsVerticalScrollIndicator={false}>
                <View style={styles.expandedSection}>
                  <Text style={styles.expandedSectionTitle}>🎾 Things I love...</Text>
                  {currentDog.fullProfile.thingsILove.map((item, index) => (
                    <Text key={index} style={styles.expandedItem}>• {item}</Text>
                  ))}
                </View>

                <View style={styles.expandedSection}>
                  <Text style={styles.expandedSectionTitle}>📚 I'm still learning...</Text>
                  {currentDog.fullProfile.stillLearning.map((item, index) => (
                    <Text key={index} style={styles.expandedItem}>• {item}</Text>
                  ))}
                </View>

                <View style={styles.expandedSection}>
                  <Text style={styles.expandedSectionTitle}>☀️ My ideal day out...</Text>
                  <Text style={styles.expandedItem}>{currentDog.fullProfile.idealDay}</Text>
                </View>
              </ScrollView>
            )}
          </View>
        </Animated.View>

        {/* Floating Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.passButton} onPress={swipeLeft} activeOpacity={0.8}>
            <X size={28} color="white" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.likeButton} onPress={swipeRight} activeOpacity={0.8}>
            <Heart size={28} color="white" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFF8F0',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#444B5A',
    marginBottom: 12,
  },
  progressTracker: {
    backgroundColor: '#8EC6DB',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  progressText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: 'relative',
  },
  card: {
    flex: 1,
    backgroundColor: '#FFF8F0',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  imageSection: {
    height: '58%',
    position: 'relative',
  },
  dogImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayBadges: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  energyBadge: {
    backgroundColor: '#8EC6DB',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  energyBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  distanceBadge: {
    backgroundColor: 'rgba(181, 193, 182, 0.9)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  distanceBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginLeft: 4,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  contentSection: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8F0',
  },
  dogIdentity: {
    marginBottom: 16,
  },
  dogName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444B5A',
    marginBottom: 8,
    lineHeight: 24,
  },
  sizeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(142, 198, 219, 0.1)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  sizeIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  sizeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8EC6DB',
  },
  temperamentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  temperamentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  temperamentIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  temperamentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444B5A',
  },
  funFactContainer: {
    backgroundColor: 'rgba(251, 191, 119, 0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#FBBF77',
  },
  funFact: {
    fontSize: 14,
    color: '#444B5A',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(142, 198, 219, 0.1)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  expandText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8EC6DB',
    marginRight: 6,
  },
  expandIcon: {
    transition: 'transform 0.3s ease',
  },
  expandedContent: {
    maxHeight: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 12,
  },
  expandedSection: {
    marginBottom: 12,
  },
  expandedSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444B5A',
    marginBottom: 6,
  },
  expandedItem: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
    marginBottom: 2,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  passButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E46E71',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E46E71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7AC79E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7AC79E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  quizCard: {
    backgroundColor: '#8EC6DB',
    borderRadius: 24,
    padding: 24,
    margin: 20,
    flex: 1,
    justifyContent: 'center',
  },
  quizQuestion: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 32,
  },
  quizOptions: {
    gap: 16,
    marginBottom: 24,
  },
  quizOption: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  quizOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444B5A',
  },
  quizNote: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  completionCard: {
    backgroundColor: '#FBBF77',
    borderRadius: 24,
    padding: 32,
    margin: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#444B5A',
    textAlign: 'center',
    marginBottom: 12,
  },
  completionSubtitle: {
    fontSize: 16,
    color: '#444B5A',
    textAlign: 'center',
    marginBottom: 16,
  },
  countdown: {
    fontSize: 14,
    color: '#B5C1B6',
    textAlign: 'center',
    marginBottom: 24,
  },
  completionButton: {
    backgroundColor: '#F86F6F',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  completionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});