import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, Animated, Dimensions, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Clock, Send, MoveVertical as MoreVertical, Calendar, X, Heart, MapPin, User, Tag } from 'lucide-react-native';
import { fetchMessages, sendMessage } from '../../lib/chat';

const { height: screenHeight } = Dimensions.get('window');

const chatData = [
  {
    id: 1,
    name: 'Sarah',
    city: 'Brooklyn',
    age: 26,
    dogAvatar: { emoji: '🐕‍🦺', label: 'Corgi', trait: 'Loyal & Low-key' },
    status: 'active',
    lastMessage: 'That sounds like such a fun adventure!',
    timeLeft: '18h left to book',
    messagesNeeded: '12 messages needed today',
    profile: {
      prompts: [
        {
          question: "If I were a dog, I'd spend my day...",
          answer: "Napping on a sunny porch and greeting every neighbor who walks by!"
        },
        {
          question: "My ideal weekend with a dog looks like...",
          answer: "A morning hike followed by brunch at a dog-friendly café, then afternoon cuddles."
        },
        {
          question: "Dogs bring out this side of me...",
          answer: "My most patient and nurturing self - I love teaching them new tricks!"
        }
      ],
      dreamDate: "We'd meet at the shelter, pick a pup, then walk to a dog café and share treats while getting to know each other.",
      tags: ['Spontaneous Adventurer', 'Couch Cuddler', 'Patient with Dogs', 'Morning Person', 'Nature-Loving'],
      dogSituation: {
        hasDog: 'Yes',
        isVolunteer: true,
        consideringAdoption: false,
        preferredEnergy: 'Medium',
        preferredSize: 'Medium'
      },
      completionPercentage: 95
    }
  },
  {
    id: 2,
    name: 'Maya',
    city: 'Manhattan',
    age: 24,
    dogAvatar: { emoji: '🐶', label: 'Terrier', trait: 'Curious & Confident' },
    status: 'time_sensitive',
    lastMessage: 'I love morning walks too!',
    timeLeft: '6h left',
    messagesNeeded: '8 messages needed today',
    profile: {
      prompts: [
        {
          question: "If I were a dog, I'd spend my day...",
          answer: "Exploring every corner of the city and making friends with everyone I meet!"
        },
        {
          question: "A dog and I would have the most fun doing...",
          answer: "Urban adventures - discovering new neighborhoods and dog-friendly spots together."
        }
      ],
      dreamDate: "A morning walk through Central Park, followed by exploring a new neighborhood and finding the best dog treats in the city.",
      tags: ['Morning Person', 'Nature-Loving', 'Dog-Park Regular', 'High Energy', 'Goofball Energy'],
      dogSituation: {
        hasDog: 'No',
        isVolunteer: false,
        consideringAdoption: true,
        preferredEnergy: 'High',
        preferredSize: 'Small'
      },
      completionPercentage: 87
    }
  },
  {
    id: 3,
    name: 'Emma',
    city: 'Queens',
    age: 29,
    dogAvatar: { emoji: '🦮', label: 'Golden', trait: 'Warm & Friendly' },
    status: 'booking',
    lastMessage: 'Ready to book our dog date?',
    timeLeft: 'Booking phase',
    messagesNeeded: 'Goal reached!',
    profile: {
      prompts: [
        {
          question: "If I were a dog, I'd spend my day...",
          answer: "Helping others and spreading joy wherever I go - just like therapy dogs do!"
        },
        {
          question: "My ideal weekend with a dog looks like...",
          answer: "Volunteering at the shelter, then a peaceful walk and cozy movie night."
        },
        {
          question: "Dogs bring out this side of me...",
          answer: "My most compassionate and caring nature - they remind me what unconditional love looks like."
        }
      ],
      dreamDate: "Meeting at the shelter where I volunteer, spending time with the dogs there, then a quiet café to talk about our favorite rescue stories.",
      tags: ['Calm & Grounded', 'Shelter Volunteer', 'Likes Routine', 'Gentle Soul', 'Patient with Dogs'],
      dogSituation: {
        hasDog: 'Sometimes',
        isVolunteer: true,
        consideringAdoption: true,
        preferredEnergy: 'Low',
        preferredSize: 'Any'
      },
      completionPercentage: 100
    }
  },
];

const sampleMessages = [
  { id: 1, text: 'Hey Sarah! I saw you love hiking with dogs too 🐾', sender: 'me', timestamp: '2:30 PM' },
  { id: 2, text: 'Yes! There\'s nothing better than a good trail adventure', sender: 'them', timestamp: '2:32 PM' },
  { id: 3, text: 'Have you been to Prospect Park? I heard they have great dog areas', sender: 'me', timestamp: '2:35 PM' },
  { id: 4, text: 'Oh absolutely! Max (my dog) loves the long meadow there', sender: 'them', timestamp: '2:37 PM' },
  { id: 5, text: 'That sounds like such a fun adventure!', sender: 'them', timestamp: '2:40 PM' },
];

const icebreakers = [
  'If your dog could talk, what would it say about you?',
  'Dream dog trip: mountain hike or beach nap?',
  'What\'s the funniest thing a dog has ever done around you?',
  'Morning dog walk or evening cuddle session?',
];

export default function ChatScreen() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [showIcebreakers, setShowIcebreakers] = useState(false);
  const [showMiniProfile, setShowMiniProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [slideAnim] = useState(new Animated.Value(screenHeight));
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openMiniProfile = (chatData: any) => {
    setSelectedProfile(chatData);
    setShowMiniProfile(true);
    Animated.spring(slideAnim, {
      toValue: screenHeight * 0.15, // Show 85% of screen
      useNativeDriver: false,
      tension: 50,
      friction: 8,
    }).start();
  };

  const closeMiniProfile = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowMiniProfile(false);
      setSelectedProfile(null);
    });
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return gestureState.dy > 0 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
    },
    onPanResponderMove: (evt, gestureState) => {
      if (gestureState.dy > 0) {
        slideAnim.setValue(screenHeight * 0.15 + gestureState.dy);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy > 100 || gestureState.vy > 0.5) {
        closeMiniProfile();
      } else {
        Animated.spring(slideAnim, {
          toValue: screenHeight * 0.15,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  const renderMiniProfile = () => {
    if (!selectedProfile) return null;

    const sharedTags = ['Morning Person', 'Nature-Loving']; // Mock shared tags

    return (
      <Modal
        visible={showMiniProfile}
        transparent={true}
        animationType="none"
        onRequestClose={closeMiniProfile}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.miniProfilePanel,
              {
                transform: [{ translateY: slideAnim }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            {/* Handle Bar */}
            <View style={styles.handleBar} />

            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeMiniProfile}
              activeOpacity={0.7}
            >
              <X size={20} color="#B5C1B6" strokeWidth={2} />
            </TouchableOpacity>

            <ScrollView
              style={styles.profileContent}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {/* Header Section */}
              <View style={styles.profileHeader}>
                <View style={styles.avatarSection}>
                  <Text style={styles.dogAvatarLarge}>{selectedProfile.dogAvatar.emoji}</Text>
                  <View style={styles.avatarInfo}>
                    <Text style={styles.avatarLabel}>{selectedProfile.dogAvatar.label}</Text>
                    <Text style={styles.avatarTrait}>{selectedProfile.dogAvatar.trait}</Text>
                  </View>
                </View>
                
                <View style={styles.userInfo}>
                  <Text style={styles.profileName}>{selectedProfile.name}</Text>
                  <View style={styles.locationAge}>
                    <MapPin size={14} color="#B5C1B6" strokeWidth={2} />
                    <Text style={styles.locationText}>{selectedProfile.city}</Text>
                    {selectedProfile.age && (
                      <>
                        <Text style={styles.ageSeparator}>•</Text>
                        <Text style={styles.ageText}>{selectedProfile.age}</Text>
                      </>
                    )}
                  </View>
                </View>

                {/* Completion Badge */}
                <View style={styles.completionBadge}>
                  <View style={[styles.completionRing, { 
                    borderColor: selectedProfile.profile.completionPercentage >= 90 ? '#7AC79E' : '#FBBF77' 
                  }]}>
                    <Text style={styles.completionText}>{selectedProfile.profile.completionPercentage}%</Text>
                  </View>
                </View>
              </View>

              {/* Dog-Lens Prompts */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Heart size={18} color="#F86F6F" strokeWidth={2} />
                  <Text style={styles.sectionTitle}>Dog-Lens Prompts</Text>
                </View>
                
                {selectedProfile.profile.prompts.map((prompt: any, index: number) => (
                  <View key={index} style={styles.promptCard}>
                    <Text style={styles.promptQuestion}>{prompt.question}</Text>
                    <Text style={styles.promptAnswer}>"{prompt.answer}"</Text>
                  </View>
                ))}
              </View>

              {/* Dream Dog Date */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Calendar size={18} color="#FBBF77" strokeWidth={2} />
                  <Text style={styles.sectionTitle}>Dream Dog Date 💞</Text>
                </View>
                
                <View style={styles.dreamDateCard}>
                  <Text style={styles.dreamDateText}>"{selectedProfile.profile.dreamDate}"</Text>
                </View>
              </View>

              {/* Values & Lifestyle Tags */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Tag size={18} color="#8EC6DB" strokeWidth={2} />
                  <Text style={styles.sectionTitle}>Values & Lifestyle</Text>
                </View>
                
                <View style={styles.tagsContainer}>
                  {selectedProfile.profile.tags.map((tag: string, index: number) => (
                    <View 
                      key={index} 
                      style={[
                        styles.tag,
                        sharedTags.includes(tag) && styles.sharedTag
                      ]}
                    >
                      <Text style={[
                        styles.tagText,
                        sharedTags.includes(tag) && styles.sharedTagText
                      ]}>
                        {tag}
                      </Text>
                      {sharedTags.includes(tag) && (
                        <Text style={styles.sharedIndicator}>✨</Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>

              {/* Dog Situation Summary */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <User size={18} color="#7AC79E" strokeWidth={2} />
                  <Text style={styles.sectionTitle}>Dog Situation</Text>
                </View>
                
                <View style={styles.dogSituationCard}>
                  <View style={styles.dogSituationRow}>
                    <Text style={styles.dogSituationIcon}>
                      {selectedProfile.profile.dogSituation.hasDog === 'Yes' ? '✅' : 
                       selectedProfile.profile.dogSituation.hasDog === 'Sometimes' ? '🔄' : '❌'}
                    </Text>
                    <Text style={styles.dogSituationText}>
                      {selectedProfile.profile.dogSituation.hasDog === 'Yes' ? 'Has a dog' :
                       selectedProfile.profile.dogSituation.hasDog === 'Sometimes' ? 'Sometimes has a dog' : 'No dog currently'}
                    </Text>
                  </View>
                  
                  {selectedProfile.profile.dogSituation.isVolunteer && (
                    <View style={styles.dogSituationRow}>
                      <Text style={styles.dogSituationIcon}>🐾</Text>
                      <Text style={styles.dogSituationText}>Volunteers at shelters</Text>
                    </View>
                  )}
                  
                  {selectedProfile.profile.dogSituation.consideringAdoption && (
                    <View style={styles.dogSituationRow}>
                      <Text style={styles.dogSituationIcon}>💡</Text>
                      <Text style={styles.dogSituationText}>Considering adoption</Text>
                    </View>
                  )}
                  
                  <View style={styles.preferencesRow}>
                    <Text style={styles.preferencesText}>
                      Prefers: {selectedProfile.profile.dogSituation.preferredSize} dogs • {selectedProfile.profile.dogSituation.preferredEnergy} energy
                    </Text>
                  </View>
                </View>
              </View>

              {/* Footer CTA - Only show if in booking phase */}
              {selectedProfile.status === 'booking' && (
                <View style={styles.footerCTA}>
                  <TouchableOpacity style={styles.planDateButton} activeOpacity={0.8}>
                    <Text style={styles.planDateButtonText}>Plan Your Dog Date 🐾</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Back to Chat Button */}
              <View style={styles.footerCTA}>
                <TouchableOpacity 
                  style={styles.backToChatButton} 
                  onPress={closeMiniProfile}
                  activeOpacity={0.8}
                >
                  <Text style={styles.backToChatButtonText}>Back to Chat</Text>
                </TouchableOpacity>
              </View>

              {/* Bottom Padding */}
              <View style={styles.bottomPadding} />
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    );
  };

  const renderChatList = () => (
    <ScrollView style={styles.chatList} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Let's Keep the Conversation Wagging!</Text>
        <View style={styles.reminderBanner}>
          <Text style={styles.reminderText}>6 messages/day keeps your match on track 🐾</Text>
        </View>
      </View>

      {/* Chat Previews */}
      <View style={styles.chatsContainer}>
        {chatData.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatPreview}
            onPress={() => setSelectedChat(chat.id)}
            activeOpacity={0.7}
          >
            <View style={styles.chatHeader}>
              <Text style={styles.dogAvatar}>{chat.dogAvatar.emoji}</Text>
              <View style={styles.chatInfo}>
                <Text style={styles.chatName}>{chat.name}</Text>
                <Text style={styles.lastMessage}>{chat.lastMessage}</Text>
              </View>
              <View style={styles.chatMeta}>
                <View
                  style={[
                    styles.statusIcon,
                    {
                      backgroundColor:
                        chat.status === 'time_sensitive'
                          ? '#F86F6F'
                          : chat.status === 'booking'
                          ? '#7AC79E'
                          : '#8EC6DB',
                    },
                  ]}
                >
                  {chat.status === 'time_sensitive' && <Clock size={12} color="white" />}
                  {chat.status === 'booking' && <Calendar size={12} color="white" />}
                  {chat.status === 'active' && <MessageCircle size={12} color="white" />}
                </View>
                <Text style={styles.timeLeft}>{chat.timeLeft}</Text>
              </View>
            </View>
            <Text style={styles.messagesNeeded}>{chat.messagesNeeded}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  // Fetch messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      setLoading(true);
      setError(null);
      fetchMessages()
        .then((data) => {
          setMessages(data || []);
          setLoading(false);
        })
        .catch((err) => {
          setError('Failed to load messages');
          setLoading(false);
        });
    }
  }, [selectedChat]);

  // Send message handler
  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      setLoading(true);
      await sendMessage(message, 'me'); // Replace 'me' with actual sender if available
      setMessage('');
      // Refetch messages after sending
      const data = await fetchMessages();
      setMessages(data || []);
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const renderChatThread = () => {
    const currentChat = chatData.find(chat => chat.id === selectedChat);
    if (!currentChat) return null;

    return (
      <View style={styles.chatThread}>
        {/* Chat Header */}
        <View style={styles.threadHeader}>
          <TouchableOpacity onPress={() => setSelectedChat(null)} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => openMiniProfile(currentChat)}
            activeOpacity={0.7}
          >
            <Text style={styles.dogAvatar}>{currentChat.dogAvatar.emoji}</Text>
            <Text style={styles.threadName}>{currentChat.name}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <MoreVertical size={20} color="#444B5A" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Booking Banner (if in booking phase) */}
        {currentChat.status === 'booking' && (
          <View style={styles.bookingBanner}>
            <Text style={styles.bookingText}>It's time to plan your real dog date!</Text>
            <TouchableOpacity style={styles.bookingButton}>
              <Text style={styles.bookingButtonText}>View Dog Options</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Messages */}
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {loading && <Text>Loading...</Text>}
          {error && <Text style={{ color: 'red' }}>{error}</Text>}
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender === 'me' ? styles.myMessage : styles.theirMessage,
              ]}
            >
              <Text style={styles.messageText}>{msg.content}</Text>
              <Text style={styles.messageTimestamp}>{msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : ''}</Text>
            </View>
          ))}
          {/* Paw trail decoration */}
          <View style={styles.pawTrail}>
            <Text style={styles.pawPrint}>🐾</Text>
          </View>
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity
              style={styles.icebreakButton}
              onPress={() => setShowIcebreakers(!showIcebreakers)}
            >
              <Text style={styles.icebreakText}>💡</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading}>
              <Send size={20} color="white" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Icebreaker Suggestions */}
          {showIcebreakers && (
            <View style={styles.icebreakers}>
              <Text style={styles.icebreakersTitle}>Need a nudge?</Text>
              {icebreakers.map((icebreaker, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.icebreakerOption}
                  onPress={() => {
                    setMessage(icebreaker);
                    setShowIcebreakers(false);
                  }}
                >
                  <Text style={styles.icebreakerText}>{icebreaker}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedChat ? renderChatThread() : renderChatList()}
      {renderMiniProfile()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  chatList: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444B5A',
    marginBottom: 12,
  },
  reminderBanner: {
    backgroundColor: '#FBBF77',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  reminderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444B5A',
    textAlign: 'center',
  },
  chatsContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  chatPreview: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dogAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444B5A',
    marginBottom: 2,
  },
  lastMessage: {
    fontSize: 14,
    color: '#B5C1B6',
  },
  chatMeta: {
    alignItems: 'flex-end',
  },
  statusIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  timeLeft: {
    fontSize: 12,
    color: '#B5C1B6',
    fontWeight: '600',
  },
  messagesNeeded: {
    fontSize: 12,
    color: '#F86F6F',
    fontWeight: '600',
  },
  chatThread: {
    flex: 1,
  },
  threadHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  backButton: {
    paddingVertical: 4,
  },
  backText: {
    fontSize: 16,
    color: '#8EC6DB',
    fontWeight: '600',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  threadName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444B5A',
    marginLeft: 8,
  },
  bookingBanner: {
    backgroundColor: '#7AC79E',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bookingText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  bookingButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  bookingButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#7AC79E',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  myMessage: {
    backgroundColor: '#F86F6F',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#8EC6DB',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
  },
  messageTimestamp: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  pawTrail: {
    alignItems: 'center',
    marginVertical: 8,
  },
  pawPrint: {
    fontSize: 16,
    opacity: 0.3,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 14,
    color: '#444B5A',
  },
  icebreakButton: {
    marginLeft: 8,
    padding: 8,
  },
  icebreakText: {
    fontSize: 20,
  },
  sendButton: {
    backgroundColor: '#F86F6F',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  icebreakers: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  icebreakersTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444B5A',
    marginBottom: 8,
  },
  icebreakerOption: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  icebreakerText: {
    fontSize: 12,
    color: '#444B5A',
  },

  // Mini Profile Panel Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  miniProfilePanel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: screenHeight * 0.85,
    backgroundColor: '#FFF8F0',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#B5C1B6',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(181, 193, 182, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  profileContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(181, 193, 182, 0.2)',
  },
  avatarSection: {
    alignItems: 'center',
    marginRight: 16,
  },
  dogAvatarLarge: {
    fontSize: 48,
    marginBottom: 8,
  },
  avatarInfo: {
    alignItems: 'center',
  },
  avatarLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444B5A',
    marginBottom: 2,
  },
  avatarTrait: {
    fontSize: 12,
    color: '#B5C1B6',
    textAlign: 'center',
  },
  userInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#444B5A',
    marginBottom: 6,
  },
  locationAge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#B5C1B6',
    marginLeft: 4,
  },
  ageSeparator: {
    fontSize: 14,
    color: '#B5C1B6',
    marginHorizontal: 8,
  },
  ageText: {
    fontSize: 14,
    color: '#B5C1B6',
  },
  completionBadge: {
    alignItems: 'center',
  },
  completionRing: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  completionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444B5A',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444B5A',
    marginLeft: 8,
  },
  promptCard: {
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
  promptQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8EC6DB',
    marginBottom: 8,
  },
  promptAnswer: {
    fontSize: 15,
    color: '#444B5A',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  dreamDateCard: {
    backgroundColor: 'rgba(251, 191, 119, 0.1)',
    borderRadius: 16,
    padding: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#FBBF77',
  },
  dreamDateText: {
    fontSize: 15,
    color: '#444B5A',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(142, 198, 219, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sharedTag: {
    backgroundColor: '#8EC6DB',
    borderColor: '#8EC6DB',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444B5A',
  },
  sharedTagText: {
    color: 'white',
  },
  sharedIndicator: {
    fontSize: 10,
    marginLeft: 4,
  },
  dogSituationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dogSituationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dogSituationIcon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  dogSituationText: {
    fontSize: 14,
    color: '#444B5A',
    flex: 1,
  },
  preferencesRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  preferencesText: {
    fontSize: 13,
    color: '#B5C1B6',
    fontStyle: 'italic',
  },
  footerCTA: {
    marginTop: 16,
    marginBottom: 8,
  },
  planDateButton: {
    backgroundColor: '#F86F6F',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#F86F6F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  planDateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  backToChatButton: {
    backgroundColor: 'rgba(142, 198, 219, 0.15)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#8EC6DB',
  },
  backToChatButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8EC6DB',
  },
  bottomPadding: {
    height: 40,
  },
});