import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, PanResponder, Animated, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, X, ChevronDown, MapPin, Sparkles, ChevronUp } from 'lucide-react-native';

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
    allTemperamentTags: [
      { icon: '🧸', label: 'Lap Dog' },
      { icon: '🐾', label: 'Friendly' },
      { icon: '⚡', label: 'High Energy' },
      { icon: '🎾', label: 'Loves Fetch' },
      { icon: '👶', label: 'Great with Kids' },
      { icon: '🏃', label: 'Active Companion' }
    ],
    funFact: 'Loves chasing squeaky toys 🎾 and soft snuggles 💕',
    fullProfile: {
      thingsILove: [
        'Long walks in the park with lots of sniffing time',
        'Playing fetch until I\'m completely exhausted',
        'Meeting new friends (both human and dog!)',
        'Belly rubs that last forever',
        'Splashing in puddles after rain'
      ],
      stillLearning: [
        'Walking on a leash without pulling too much',
        'Not jumping on visitors when I\'m excited',
        'Sharing my favorite tennis ball',
        'Staying calm during thunderstorms'
      ],
      idealDay: 'A morning hike followed by a nap in the sunshine, then some playtime at the dog park, and ending with cuddles on the couch while watching movies together.'
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
    allTemperamentTags: [
      { icon: '🧠', label: 'Smart Cookie' },
      { icon: '💝', label: 'Gentle Soul' },
      { icon: '🎾', label: 'Loves Fetch' },
      { icon: '🏃', label: 'Athletic' },
      { icon: '🎯', label: 'Focused' },
      { icon: '🌟', label: 'Quick Learner' }
    ],
    funFact: 'Can solve puzzle toys in under 5 minutes! 🧩✨',
    fullProfile: {
      thingsILove: [
        'Mental challenges that make me think hard',
        'Agility courses and obstacle training',
        'Learning new tricks and commands',
        'Herding anything that moves (including leaves!)',
        'Problem-solving games with treats'
      ],
      stillLearning: [
        'Patience during grooming sessions',
        'Sharing toys with other dogs',
        'Not herding small children at the park',
        'Relaxing when there\'s nothing to do'
      ],
      idealDay: 'Brain games in the morning to tire out my mind, then a challenging hike with lots of new sights and smells, followed by training time where I can show off my skills.'
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
    allTemperamentTags: [
      { icon: '🌿', label: 'Nature-Loving' },
      { icon: '🌅', label: 'Morning Person' },
      { icon: '💆', label: 'Gentle Soul' },
      { icon: '👃', label: 'Scent Tracker' },
      { icon: '🛋️', label: 'Couch Buddy' },
      { icon: '🍪', label: 'Treat Lover' }
    ],
    funFact: 'Champion nap-taker and treat connoisseur! 😴🍪',
    fullProfile: {
      thingsILove: [
        'Sniffing adventures where I can follow interesting scents',
        'Cozy blankets and warm sunny spots',
        'Gentle pets behind my ears',
        'Discovering new treats and flavors',
        'Peaceful walks without rushing'
      ],
      stillLearning: [
        'Coming when called during exciting smell investigations',
        'Not begging too obviously for table scraps',
        'Walking past the cat next door without stopping',
        'Sharing my favorite napping spots'
      ],
      idealDay: 'A leisurely sniff walk in the morning when all the best smells are fresh, followed by a cozy afternoon nap in a sunny spot, then some gentle playtime and treats before settling in for evening cuddles.'
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
  const [scrollOffset, setScrollOffset] = useState(0);
  const [showScrollCue, setShowScrollCue] = useState(true);

  const pan = new Animated.ValueXY();
  const rotate = pan.x.interpolate({
    inputRange: [-screenWidth / 2, 0, screenWidth / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      // Only respond to horizontal swipes, not vertical scrolls
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
    },
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
    setScrollOffset(0);
    setShowScrollCue(true);
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

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollOffset(offsetY);
    if (offsetY > 10 && showScrollCue) {
      setShowScrollCue(false);
    }
  };

  const getEnergyTintColor = (energyLevel: string) => {
    switch (energyLevel) {
      case 'Chill Companion':
        return 'rgba(181, 193, 182, 0.08)'; // Sage Gray overlay
      case 'Playful Explorer':
        return 'rgba(251, 191, 119, 0.08)'; // Golden Apricot overlay
      case 'High-Octane':
        return 'rgba(248, 111, 111, 0.08)'; // Warm Coral overlay
      default:
        return 'rgba(142, 198, 219, 0.08)'; // Default blue overlay
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
            {
              transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Energy Tint Overlay */}
          <View style={[styles.energyTint, { backgroundColor: getEnergyTintColor(currentDog.energyLevel) }]} />
          
          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollableContent}
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            bounces={true}
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
                      { backgroundColor: index === imageIndex ? '#F86F6F' : 'rgba(255, 255, 255, 0.6)' }
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

              {/* Temperament Tags (Preview) */}
              <View style={styles.temperamentTags}>
                {currentDog.temperamentTags.map((tag, index) => (
                  <View key={index} style={styles.temperamentTag}>
                    <Text style={styles.temperamentIcon}>{tag.icon}</Text>
                    <Text style={styles.temperamentText}>{tag.label}</Text>
                  </View>
                ))}
              </View>

              {/* Fun Fact - Enhanced Readability */}
              <View style={styles.funFactContainer}>
                <View style={styles.funFactHeader}>
                  <Sparkles size={16} color="#FBBF77" strokeWidth={2} />
                  <Text style={styles.funFactLabel}>Fun Fact</Text>
                </View>
                <Text style={styles.funFact}>"{currentDog.funFact}"</Text>
              </View>

              {/* Full Temperament Tags */}
              <View style={styles.fullTemperamentSection}>
                <Text style={styles.sectionTitle}>All My Traits</Text>
                <View style={styles.allTemperamentTags}>
                  {currentDog.allTemperamentTags.map((tag, index) => (
                    <View key={index} style={styles.fullTemperamentTag}>
                      <Text style={styles.temperamentIcon}>{tag.icon}</Text>
                      <Text style={styles.temperamentText}>{tag.label}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Expanded Profile Sections */}
              <View style={styles.profileSection}>
                <Text style={styles.sectionTitle}>🎾 Things I love...</Text>
                <View style={styles.profileList}>
                  {currentDog.fullProfile.thingsILove.map((item, index) => (
                    <Text key={index} style={styles.profileItem}>• {item}</Text>
                  ))}
                </View>
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.sectionTitle}>📚 I'm still learning...</Text>
                <View style={styles.profileList}>
                  {currentDog.fullProfile.stillLearning.map((item, index) => (
                    <Text key={index} style={styles.profileItem}>• {item}</Text>
                  ))}
                </View>
              </View>

              <View style={styles.profileSection}>
                <Text style={styles.sectionTitle}>☀️ My ideal day out...</Text>
                <Text style={styles.idealDayText}>{currentDog.fullProfile.idealDay}</Text>
              </View>

              {/* Bottom Padding for Scroll */}
              <View style={styles.bottomPadding} />
            </View>
          </ScrollView>
        </Animated.View>

        {/* Scroll Cue */}
        {showScrollCue && (
          <Animated.View style={[styles.scrollCue, { opacity: showScrollCue ? 1 : 0 }]}>
            <ChevronUp size={20} color="#8EC6DB" strokeWidth={2} />
            <Text style={styles.scrollCueText}>Swipe up to meet me better!</Text>
          </Animated.View>
        )}

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
    position: 'relative',
  },
  energyTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  scrollableContent: {
    flex: 1,
    zIndex: 2,
  },
  imageSection: {
    height: screenHeight * 0.35,
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
    backgroundColor: 'rgba(142, 198, 219, 0.15)',
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
    marginBottom: 20,
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
    backgroundColor: 'rgba(142, 198, 219, 0.12)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#8EC6DB',
  },
  funFactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  funFactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444B5A',
    marginLeft: 6,
  },
  funFact: {
    fontSize: 15,
    color: '#444B5A',
    fontStyle: 'italic',
    lineHeight: 22,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444B5A',
    marginBottom: 12,
  },
  fullTemperamentSection: {
    marginBottom: 24,
  },
  allTemperamentTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  fullTemperamentTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(142, 198, 219, 0.2)',
  },
  profileSection: {
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: 16,
  },
  profileList: {
    gap: 8,
  },
  profileItem: {
    fontSize: 14,
    color: '#444B5A',
    lineHeight: 20,
    paddingLeft: 4,
  },
  idealDayText: {
    fontSize: 14,
    color: '#444B5A',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  bottomPadding: {
    height: 100,
  },
  scrollCue: {
    position: 'absolute',
    bottom: 110,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 248, 240, 0.95)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginHorizontal: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollCueText: {
    fontSize: 12,
    color: '#8EC6DB',
    fontWeight: '600',
    marginTop: 2,
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