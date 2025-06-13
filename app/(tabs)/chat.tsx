import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Clock, Send, MoveVertical as MoreVertical, Calendar } from 'lucide-react-native';

const chatData = [
  {
    id: 1,
    name: 'Sarah',
    dogAvatar: '🐕‍🦺',
    status: 'active',
    lastMessage: 'That sounds like such a fun adventure!',
    timeLeft: '18h left to book',
    messagesNeeded: '12 messages needed today',
  },
  {
    id: 2,
    name: 'Maya',
    dogAvatar: '🐶',
    status: 'time_sensitive',
    lastMessage: 'I love morning walks too!',
    timeLeft: '6h left',
    messagesNeeded: '8 messages needed today',
  },
  {
    id: 3,
    name: 'Emma',
    dogAvatar: '🦮',
    status: 'booking',
    lastMessage: 'Ready to book our dog date?',
    timeLeft: 'Booking phase',
    messagesNeeded: 'Goal reached!',
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
              <Text style={styles.dogAvatar}>{chat.dogAvatar}</Text>
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
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.dogAvatar}>{currentChat.dogAvatar}</Text>
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
          {sampleMessages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender === 'me' ? styles.myMessage : styles.theirMessage,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
              <Text style={styles.messageTimestamp}>{msg.timestamp}</Text>
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
            <TouchableOpacity style={styles.sendButton}>
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
});