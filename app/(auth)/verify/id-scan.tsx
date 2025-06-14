import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronLeft, Camera, Upload, Shield, AlertCircle } from 'lucide-react-native';

export default function IdScanScreen() {
  const router = useRouter();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleTakePhoto = () => {
    // Simulate taking a photo
    Alert.alert(
      'Camera',
      'In a real app, this would open the camera to take a photo of your ID.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Simulate Photo',
          onPress: () => {
            // Add a placeholder image to simulate upload
            setUploadedImages(prev => [...prev, 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg']);
          }
        }
      ]
    );
  };

  const handleUploadFromGallery = () => {
    // Simulate uploading from gallery
    Alert.alert(
      'Photo Gallery',
      'In a real app, this would open your photo gallery to select an ID photo.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Simulate Upload',
          onPress: () => {
            // Add a placeholder image to simulate upload
            setUploadedImages(prev => [...prev, 'https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg']);
          }
        }
      ]
    );
  };

  const handleContinue = () => {
    if (uploadedImages.length === 0) {
      Alert.alert('Required', 'Please upload at least one photo of your ID to continue.');
      return;
    }
    router.push('/(auth)/verify/selfie-video');
  };

  const instructions = [
    'Take clear photos of your government-issued ID',
    'For license or ID: scan front and back',
    'For passport: scan the photo page only',
    'Make sure all text is visible and nothing is covered'
  ];

  return (
    <LinearGradient
      colors={['#F0F8FF', '#E6E6FA', '#FFF8F0']}
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
              <View style={[styles.progressFill, { width: '33%' }]} />
            </View>
            <Text style={styles.stepText}>Step 1 of 3</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Upload a Valid ID</Text>
              <Text style={styles.subtitle}>
                We need to verify your identity to keep our community safe
              </Text>
            </View>

            <View style={styles.instructionsCard}>
              <Text style={styles.instructionsTitle}>Instructions</Text>
              {instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>

            <View style={styles.uploadSection}>
              <Text style={styles.uploadTitle}>Upload Your ID</Text>
              
              <View style={styles.uploadOptions}>
                <TouchableOpacity
                  style={styles.uploadOption}
                  onPress={handleTakePhoto}
                  activeOpacity={0.7}
                >
                  <Camera size={32} color="#8EC6DB" strokeWidth={2} />
                  <Text style={styles.uploadOptionTitle}>Take Photo</Text>
                  <Text style={styles.uploadOptionSubtitle}>Use your camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.uploadOption}
                  onPress={handleUploadFromGallery}
                  activeOpacity={0.7}
                >
                  <Upload size={32} color="#FBBF77" strokeWidth={2} />
                  <Text style={styles.uploadOptionTitle}>Upload Photo</Text>
                  <Text style={styles.uploadOptionSubtitle}>From gallery</Text>
                </TouchableOpacity>
              </View>

              {uploadedImages.length > 0 && (
                <View style={styles.uploadedSection}>
                  <Text style={styles.uploadedTitle}>Uploaded Images</Text>
                  <View style={styles.uploadedImages}>
                    {uploadedImages.map((image, index) => (
                      <View key={index} style={styles.uploadedImageContainer}>
                        <Image source={{ uri: image }} style={styles.uploadedImage} />
                        <View style={styles.uploadedImageOverlay}>
                          <Text style={styles.uploadedImageText}>ID {index + 1}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>

            <View style={styles.privacyNote}>
              <Shield size={20} color="#7AC79E" strokeWidth={2} />
              <Text style={styles.privacyText}>
                This image is never shared and is encrypted for verification only.
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                uploadedImages.length === 0 && styles.buttonDisabled
              ]}
              onPress={handleContinue}
              disabled={uploadedImages.length === 0}
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
    backgroundColor: '#8EC6DB',
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
  uploadSection: {
    marginBottom: 32,
  },
  uploadTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#444B5A',
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadOptions: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  uploadOption: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadOptionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
    marginTop: 12,
    marginBottom: 4,
  },
  uploadOptionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  uploadedSection: {
    marginTop: 16,
  },
  uploadedTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
    marginBottom: 12,
  },
  uploadedImages: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadedImageContainer: {
    position: 'relative',
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  uploadedImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    paddingVertical: 4,
    alignItems: 'center',
  },
  uploadedImageText: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: 'white',
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(122, 199, 158, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  privacyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#444B5A',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
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