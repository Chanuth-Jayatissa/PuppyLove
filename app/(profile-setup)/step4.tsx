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
import { ChevronLeft, Tag } from 'lucide-react-native';

const mockTags = [
  { id: '1', label: 'Nature-Loving' },
  { id: '2', label: 'Goofball Energy' },
  { id: '3', label: 'Morning Person' },
  { id: '4', label: 'Calm & Grounded' },
  { id: '5', label: 'Likes Routine' },
  { id: '6', label: 'Spontaneous Adventurer' },
  { id: '7', label: 'Patient with Dogs' },
  { id: '8', label: 'Couch Cuddler' },
  { id: '9', label: 'Shelter Volunteer' },
  { id: '10', label: 'Dog-Park Regular' },
  { id: '11', label: 'High Energy' },
  { id: '12', label: 'Gentle Soul' },
];

export default function ProfileSetupStep4() {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(t => t !== tagId));
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSaveAndNext = async () => {
    if (selectedTags.length < 3) {
      Alert.alert(
        'More Tags Needed', 
        `Please select at least 3 tags that describe you. You've selected ${selectedTags.length} so far.`
      );
      return;
    }

    setSaving(true);
    try {
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/(profile-setup)/step5');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to save your tags. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getTagById = (id: string) => {
    return mockTags.find(tag => tag.id === id);
  };

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
              <View style={[styles.progressFill, { width: '80%' }]} />
            </View>
            <Text style={styles.stepText}>Step 4 of 5</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.titleSection}>
              <View style={styles.iconContainer}>
                <Tag size={32} color="#8EC6DB" strokeWidth={2} />
              </View>
              <Text style={styles.title}>Tag Your Values & Vibe</Text>
              <Text style={styles.subtitle}>
                Choose 3-5 tags that best describe your lifestyle and values
              </Text>
            </View>

            <View style={styles.progressTracker}>
              <Text style={styles.progressText}>
                {selectedTags.length} of 5 tags selected
              </Text>
              <Text style={styles.progressSubtext}>
                (Minimum 3 required)
              </Text>
            </View>

            <View style={styles.tagsContainer}>
              {mockTags.map((tag) => (
                <TouchableOpacity
                  key={tag.id}
                  style={[
                    styles.tag,
                    selectedTags.includes(tag.id) && styles.selectedTag,
                    selectedTags.length >= 5 && !selectedTags.includes(tag.id) && styles.disabledTag
                  ]}
                  onPress={() => toggleTag(tag.id)}
                  disabled={selectedTags.length >= 5 && !selectedTags.includes(tag.id)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.tagText,
                      selectedTags.includes(tag.id) && styles.selectedTagText,
                      selectedTags.length >= 5 && !selectedTags.includes(tag.id) && styles.disabledTagText
                    ]}
                  >
                    {tag.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.selectedTagsPreview}>
              <Text style={styles.previewTitle}>Your selected tags:</Text>
              <View style={styles.previewTags}>
                {selectedTags.length === 0 ? (
                  <Text style={styles.noTagsText}>No tags selected yet</Text>
                ) : (
                  selectedTags.map((tagId) => {
                    const tag = getTagById(tagId);
                    return tag ? (
                      <View key={tagId} style={styles.previewTag}>
                        <Text style={styles.previewTagText}>{tag.label}</Text>
                      </View>
                    ) : null;
                  })
                )}
              </View>
            </View>

            <View style={styles.encouragementCard}>
              <Text style={styles.encouragementText}>
                🐾 These tags help us match you with people who share your lifestyle and values!
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                (selectedTags.length < 3 || saving) && styles.buttonDisabled
              ]}
              onPress={handleSaveAndNext}
              disabled={selectedTags.length < 3 || saving}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>
                {saving ? 'Saving...' : 'Save & Next'}
              </Text>
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
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  progressTracker: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  progressText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#8EC6DB',
    marginBottom: 4,
  },
  progressSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  tag: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOp: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedTag: {
    backgroundColor: '#8EC6DB',
    borderColor: '#8EC6DB',
  },
  disabledTag: {
    backgroundColor: '#F5F5F5',
    opacity: 0.5,
  },
  tagText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#444B5A',
  },
  selectedTagText: {
    color: 'white',
  },
  disabledTagText: {
    color: '#B5C1B6',
  },
  selectedTagsPreview: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  previewTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
    marginBottom: 12,
  },
  previewTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  noTagsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#B5C1B6',
    fontStyle: 'italic',
  },
  previewTag: {
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  previewTagText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#8EC6DB',
  },
  encouragementCard: {
    backgroundColor: 'rgba(142, 198, 219, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#8EC6DB',
  },
  encouragementText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#444B5A',
    lineHeight: 20,
    textAlign: 'center',
  },
  saveButton: {
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
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 18,
  },
});