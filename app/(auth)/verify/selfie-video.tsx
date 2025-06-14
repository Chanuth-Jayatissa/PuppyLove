import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronLeft, Video, Play, CircleCheck as CheckCircle, User } from 'lucide-react-native';

export default function SelfieVideoScreen() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const handleStartRecording = () => {
    Alert.alert(
      'Video Recording',
      'In a real app, this would start video recording for identity verification.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Simulate Recording',
          onPress: () => {
            setIsRecording(true);
            // Simulate recording for 3 seconds
            setTimeout(() => {
              setIsRecording(false);
              setHasRecorded(true);
            }, 3000);
          }
        }
      ]
    );
  };

  const handleContinue = () => {
    if (!hasRecorded) {
      Alert.alert('Required', 'Please record a selfie video to continue.');
      return;
    }
    router.push('/(auth)/verify/in-review');
  };

  const instructions = [
    'Record a short video of yourself saying your name',
    'Turn your head slowly left and right',
    'Make sure your face is well-lit and clearly visible',
    'This confirms you\'re a real human and matches your face to the ID'
  ];

  return (
    <LinearGradient
      colors={['#FFE4E1', '#FFF0F5', '#F0F8FF']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color="#444B5A" strokeWidth={2} />
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '66%' }]} />
            </View>
            <Text style={styles.stepText}>Step 2 of 3</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Now, a Quick Selfie</Text>
              <Text style={styles.subtitle}>
                This helps us confirm you're a real person and matches your face to your ID
              </Text>
            </View>

            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsTitle}>Recording Instructions</Text>
              {instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>

            <View style={styles.recordingSection}>
              <View style={styles.cameraPreview}>
                {!hasRecorded && !isRecording && (
                  <View style={styles.cameraPlaceholder}>
                    <User size={48} color="#B5C1B6" strokeWidth={2} />
                    <Text style={styles.cameraPlaceholderText}>
                      Camera preview will appear here
                    </Text>
                  </View>
                )}

                {isRecording && (
                  <View style={styles.recordingIndicator}>
                    <View style={styles.recordingDot} />
                    <Text style={styles.recordingText}>Recording...</Text>
                  </View>
                )}

                {hasRecorded && (
                  <View style={styles.recordingComplete}>
                    <CheckCircle size={48} color="#7AC79E" strokeWidth={2} />
                    <Text style={styles.recordingCompleteText}>
                      Video recorded successfully!
                    </Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.recordButton,
                  isRecording && styles.recordingButton,
                  hasRecorded && styles.recordedButton
                ]}
                onPress={handleStartRecording}
                disabled={isRecording || hasRecorded}
                activeOpacity={0.8}
              >
                {!hasRecorded && !isRecording && (
                  <>
                    <Video size={24} color="white" strokeWidth={2} />
                    <Text style={styles.recordButtonText}>Start Recording</Text>
                  </>
                )}
                
                {isRecording && (
                  <>
                    <View style={styles.recordingButtonDot} />
                    <Text style={styles.recordButtonText}>Recording...</Text>
                  </>
                )}

                {hasRecorded && (
                  <>
                    <CheckCircle size={24} color="white" strokeWidth={2} />
                    <Text style={styles.recordButtonText}>Recorded</Text>
                  </>
                )}
              </TouchableOpacity>

              {hasRecorded && (
                <TouchableOpacity
                  style={styles.retakeButton}
                  onPress={() => {
                    setHasRecorded(false);
                    setIsRecording(false);
                  }}
                >
                  <Text style={styles.retakeButtonText}>Record Again</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.privacyNote}>
              <Text style={styles.privacyText}>
                🔒 Your video is encrypted and only used for verification. It's never shared or stored permanently.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                !hasRecorded && styles.buttonDisabled
              ]}
              onPress={handleContinue}
              disabled={!hasRecorded}
              activeOpacity={0.8}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
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
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
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
  },
  instructionsCard: {
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
  instructionsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F86F6F',
    marginTop: 6,
    marginRight: 12,
  },
  instructionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    flex: 1,
  },
  recordingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  cameraPreview: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  cameraPlaceholder: {
    alignItems: 'center',
  },
  cameraPlaceholderText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#B5C1B6',
    marginTop: 12,
    textAlign: 'center',
  },
  recordingIndicator: {
    alignItems: 'center',
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F86F6F',
    marginBottom: 12,
  },
  recordingText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#F86F6F',
  },
  recordingComplete: {
    alignItems: 'center',
  },
  recordingCompleteText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#7AC79E',
    marginTop: 12,
    textAlign: 'center',
  },
  recordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F86F6F',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#F86F6F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  recordingButton: {
    backgroundColor: '#FBBF77',
  },
  recordedButton: {
    backgroundColor: '#7AC79E',
  },
  recordButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
  recordingButtonDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  retakeButton: {
    marginTop: 16,
    paddingVertical: 8,
  },
  retakeButtonText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#8EC6DB',
  },
  privacyNote: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  privacyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#444B5A',
    lineHeight: 20,
    textAlign: 'center',
  },
  continueButton: {
    backgroundColor: '#F86F6F',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#F86F6F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#B5C1B6',
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 18,
  },
});