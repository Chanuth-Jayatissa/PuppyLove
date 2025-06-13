import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, PanResponder, Animated, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, X, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const dogData = [
  {
    id: 1,
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: '2 years old',
    size: 'Large',
    distance: '3 miles from you',
    images: [
      'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg',
      'https://images.pexels.com/photos/160846/french-bulldog-summer-smile-joy-160846.jpeg',
      'https://images.pexels.com/photos/356378/pexels-photo-356378.jpeg',
    ],
    tags: ['Playful Explorer', 'Great with Kids', 'High Energy'],
    funFact: 'Loves sunbathing and rolling in grass!',
  },
  {
    id: 2,
    name: 'Luna',
    breed: 'Border Collie',
    age: '1.5 years old',
    size: 'Medium',
    distance: '5 miles from you',
    images: [
      'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg',
      'https://images.pexels.com/photos/97082/pexels-photo-97082.jpeg',
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg',
    ],
    tags: ['Smart Cookie', 'Gentle Soul', 'Loves Fetch'],
    funFact: 'Can solve puzzle toys in under 5 minutes!',
  },
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
        // Swipe right - like
        swipeRight();
      } else if (gestureState.dx < -120) {
        // Swipe left - pass
        swipeLeft();
      } else {
        // Snap back
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
    setExploredCount(prev => prev + 1);
    
    if ((exploredCount + 1) % 3 === 0) {
      setShowQuiz(true);
    } else {
      setCurrentIndex((prev) => (prev + 1) % dogData.length);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    setQuizAnswered(prev => prev + 1);
    setShowQuiz(false);
    setCurrentQuiz((prev) => (prev + 1) % quizQuestions.length);
    setCurrentIndex((prev) => (prev + 1) % dogData.length);
  };

  const cycleImage = () => {
    const currentDog = dogData[currentIndex];
    setImageIndex((prev) => (prev + 1) % currentDog.images.length);
  };

  if (exploredCount >= 15) {
    return (
      <SafeAreaView style={styles.container}>
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

  const currentDog = dogData[currentIndex];

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
          <TouchableOpacity onPress={cycleImage} style={styles.imageContainer}>
            <Image source={{ uri: currentDog.images[imageIndex] }} style={styles.dogImage} />
            <View style={styles.imageIndicators}>
              {currentDog.images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    { backgroundColor: index === imageIndex ? '#F86F6F' : '#B5C1B6' }
                  ]}
                />
              ))}
            </View>
          </TouchableOpacity>

          <View style={styles.cardContent}>
            <View style={styles.dogInfo}>
              <Text style={styles.dogName}>{currentDog.name}</Text>
              <Text style={styles.dogBreed}>{currentDog.breed}</Text>
              <Text style={styles.dogDetails}>
                {currentDog.age} · {currentDog.size}
              </Text>
              <Text style={styles.distance}>{currentDog.distance}</Text>
            </View>

            <View style={styles.tags}>
              {currentDog.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.funFactContainer}>
              <Text style={styles.funFact}>"{currentDog.funFact}"</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity style={styles.bookmarkButton}>
                <Heart size={20} color="#F86F6F" strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.expandButton}>
                <MoreHorizontal size={20} color="#444B5A" strokeWidth={2} />
                <Text style={styles.expandText}>View Full Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        <View style={styles.swipeButtons}>
          <TouchableOpacity style={styles.passButton} onPress={swipeLeft}>
            <X size={28} color="white" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.likeButton} onPress={swipeRight}>
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
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    height: screenHeight * 0.4,
    position: 'relative',
  },
  dogImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageIndicators: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    gap: 6,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  dogInfo: {
    marginBottom: 16,
  },
  dogName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#444B5A',
    marginBottom: 4,
  },
  dogBreed: {
    fontSize: 18,
    color: '#B5C1B6',
    marginBottom: 4,
  },
  dogDetails: {
    fontSize: 16,
    color: '#444B5A',
    marginBottom: 4,
  },
  distance: {
    fontSize: 14,
    color: '#B5C1B6',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#8EC6DB',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  funFactContainer: {
    backgroundColor: '#FFF8F0',
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
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8F0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F86F6F',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  expandText: {
    fontSize: 14,
    color: '#444B5A',
    fontWeight: '600',
    marginLeft: 8,
  },
  swipeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  passButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#B5C1B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F86F6F',
    alignItems: 'center',
    justifyContent: 'center',
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