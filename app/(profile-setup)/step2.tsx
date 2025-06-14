import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronLeft, Check } from 'lucide-react-native';
import { useProfile } from '@/hooks/useProfile';

const promptOptions = [
  "If I were a dog, I'd spend my day...",
  "A dog and I would have the most fun doing...",
  "My ideal walk is...",
  "If love were a dog trick, it'd be...",
  "Fetch me someone who...",
];

const promptTypeMap: { [key: string]: string } = {
  "If I were a dog, I'd spend my day...": 'ideal_day',
  "A dog and I would have the most fun doing...": 'fun_activity',
  "My ideal walk is...": 'weekend',
  "If love were a dog trick, it'd be...": 'dream_bond',
  "Fetch me someone who...": 'dog_connection',
};

export default function ProfileSetupStep2() {
  const router = useRouter();
  const { prompts, updatePrompt } = useProfile();
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [promptAnswers, setPromptAnswers] = useState<{[key: string]: string}>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Initialize from existing prompts
    const promptMap: {[key: string]: string} = {};
    const selectedPromptsList: string[] = [];
    
    prompts.forEach(prompt => {
      const promptText = Object.keys(promptTypeMap).find(
        key => promptTypeMap[key] === prompt.prompt_type
      );
      if (promptText) {
        promptMap[promptText] = prompt.answer;
        selectedPromptsList.push(promptText);
      }
    });
    
    setPromptAnswers(promptMap);
    setSelectedPrompts(selectedPromptsList);
  }, [prompts]);

  const togglePrompt = (prompt: string) => {
    if (selectedPrompts.includes(prompt)) {
      setSelectedPrompts(selectedPrompts.filter(p => p !== prompt));
      const newAnswers = { ...promptAnswers };
      delete newAnswers[prompt];
      setPromptAnswers(newAnswers);
    } else if (selectedPrompts.length < 5) {
      setSelectedPrompts([...selectedPrompts, prompt]);
    }
  };

  const getCompletedCount = () => {
    return selectedPrompts.filter(prompt => 
      promptAnswers[prompt] && promptAnswers[prompt].trim().length > 0
    ).length;
  };

  const handleSaveAndNext = async () => {
    const completedCount = getCompletedCount();
    
    if (completedCount < 3) {
      Alert.alert(
        'More Answers Needed', 
        `Please complete at least 3 prompts. You've completed ${completedCount} so far.`
      );
      return;
    }

    setSaving(true);
    try {
      // Save all completed prompts
      for (const prompt of selectedPrompts) {
        const answer = promptAnswers[prompt];
        if (answer && answer.trim().length > 0) {
          await updatePrompt(promptTypeMap[prompt], answer);
        }
      }
      
      router.push('/(profile-setup)/step3');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to save your answers. Please try again.');
    } finally {
      setSaving(false);
    }
  };

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
              <View style={[styles.progressFill, { width: '40%' }]} />
            </View>
            <Text style={styles.stepText}>Step 2 of 5</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Show Us Your Dog Side</Text>
              <Text style={styles.subtitle}>
                Choose at least 3 prompts to answer and let your personality shine through
              </Text>
            </View>

            <View style={styles.progressTracker}>
              <Text style={styles.progressText}>
                {getCompletedCount()} of {selectedPrompts.length} prompts completed
              </Text>
              <Text style={styles.progressSubtext}>
                (Minimum 3 required)
              </Text>
            </View>

            <View style={styles.promptsContainer}>
              {promptOptions.map((prompt, index) => (
                <View key={index} style={styles.promptContainer}>
                  <TouchableOpacity
                    style={[
                      styles.promptSelector,
                      selectedPrompts.includes(prompt) && styles.selectedPrompt
                    ]}
                    onPress={() => togglePrompt(prompt)}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.promptText,
                      selectedPrompts.includes(prompt) && styles.selectedPromptText
                    ]}>
                      {prompt}
                    </Text>
                    {selectedPrompts.includes(prompt) && (
                      <Check size={16} color="#F86F6F" strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                  
                  {selectedPrompts.includes(prompt) && (
                    <View style={styles.answerContainer}>
                      <TextInput
                        style={styles.promptInput}
                        placeholder="Share your thoughts here..."
                        value={promptAnswers[prompt] || ''}
                        onChangeText={(text) => 
                          setPromptAnswers({...promptAnswers, [prompt]: text})
                        }
                        multiline
                        maxLength={300}
                        placeholderTextColor="#B5C1B6"
                      />
                      <Text style={styles.charCount}>
                        {(promptAnswers[prompt] || '').length}/300
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.encouragementCard}>
              <Text style={styles.encouragementText}>
                🐾 These answers help us find people who share your energy and values!
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                (getCompletedCount() < 3 || saving) && styles.buttonDisabled
              ]}
              onPress={handleSaveAndNext}
              disabled={getCompletedCount() < 3 || saving}
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
    color: '#F86F6F',
    marginBottom: 4,
  },
  progressSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  promptsContainer: {
    marginBottom: 24,
  },
  promptContainer: {
    marginBottom: 20,
  },
  promptSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  selectedPrompt: {
    backgroundColor: '#FFF8F0',
    borderColor: '#F86F6F',
  },
  promptText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
    flex: 1,
    marginRight: 12,
  },
  selectedPromptText: {
    color: '#F86F6F',
  },
  answerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  promptInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#444B5A',
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  charCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#B5C1B6',
    textAlign: 'right',
  },
  encouragementCard: {
    backgroundColor: 'rgba(248, 111, 111, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderLeftWidth: 4,
    borderLeftColor: '#F86F6F',
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