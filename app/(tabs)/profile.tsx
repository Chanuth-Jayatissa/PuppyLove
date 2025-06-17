import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';

const mockDogAvatars = [
  { id: '1', emoji: '🐕‍🦺', label: 'Corgi', trait: 'Loyal & Low-key' },
  { id: '2', emoji: '🐺', label: 'Husky', trait: 'Bold & Energetic' },
  { id: '3', emoji: '🦮', label: 'Golden', trait: 'Warm & Friendly' },
  { id: '4', emoji: '🐶', label: 'Terrier', trait: 'Curious & Confident' },
  { id: '5', emoji: '🐕', label: 'Bulldog', trait: 'Calm & Steady' },
  { id: '6', emoji: '🐩', label: 'Poodle', trait: 'Smart & Playful' },
];

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

const promptOptions = [
  "If I were a dog, I'd spend my day...",
  "A dog and I would have the most fun doing this together...",
  "My ideal weekend with a dog looks like...",
  "The kind of dog I'd bond with is...",
  "Dogs bring out this side of me...",
];

export default function ProfileScreen() {
  const [selectedAvatar, setSelectedAvatar] = useState('1');
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([promptOptions[0], promptOptions[1], promptOptions[2]]);
  const [promptAnswers, setPromptAnswers] = useState<{[key: string]: string}>({
    [promptOptions[0]]: 'Playing fetch in the park and then napping in a sunny spot!',
    [promptOptions[1]]: 'Going on hiking adventures and exploring new trails together.',
    [promptOptions[2]]: 'A morning walk, dog café brunch, and afternoon cuddles on the couch.',
  });
  const [dreamDateBio, setDreamDateBio] = useState('We\'d meet at the shelter, pick a pup, then walk to a dog café and share treats while getting to know each other.');
  const [selectedTags, setSelectedTags] = useState<string[]>(['1', '3', '6', '9']);
  const [hasDog, setHasDog] = useState('Yes');
  const [isVolunteer, setIsVolunteer] = useState(true);
  const [consideringAdoption, setConsideringAdoption] = useState(false);
  const [preferredEnergy, setPreferredEnergy] = useState('Medium');
  const [preferredSize, setPreferredSize] = useState('Any');

  const togglePrompt = (prompt: string) => {
    if (selectedPrompts.includes(prompt)) {
      setSelectedPrompts(selectedPrompts.filter(p => p !== prompt));
      const newAnswers = { ...promptAnswers };
      delete newAnswers[prompt];
      setPromptAnswers(newAnswers);
    } else if (selectedPrompts.length < 3) {
      setSelectedPrompts([...selectedPrompts, prompt]);
    }
  };

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(t => t !== tagId));
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    let total = 6;

    if (selectedAvatar) completed++;
    if (selectedPrompts.length >= 3 && selectedPrompts.every(p => promptAnswers[p]?.length > 0)) completed++;
    if (dreamDateBio.length >= 50) completed++;
    if (selectedTags.length >= 3) completed++;
    if (hasDog) completed++;
    if (preferredEnergy && preferredSize) completed++;

    return Math.round((completed / total) * 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Completion Tracker */}
        <View style={styles.completionTracker}>
          <Text style={styles.completionText}>
            You've completed {getCompletionPercentage()}% of your profile
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${getCompletionPercentage()}%` }]} 
            />
          </View>
        </View>

        {/* Dog Avatar Picker */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who's Your Inner Pup?</Text>
          <View style={styles.avatarGrid}>
            {mockDogAvatars.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                style={[
                  styles.avatarOption,
                  selectedAvatar === avatar.id && styles.selectedAvatar
                ]}
                onPress={() => setSelectedAvatar(avatar.id)}
              >
                <Text style={styles.avatarEmoji}>{avatar.emoji}</Text>
                <Text style={styles.avatarName}>{avatar.label}</Text>
                <Text style={styles.avatarTrait}>{avatar.trait}</Text>
                {selectedAvatar === avatar.id && (
                  <View style={styles.checkIcon}>
                    <Check size={16} color="white" strokeWidth={2} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Dog-Lens Prompts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Show Us Your Dog Side</Text>
          <Text style={styles.sectionSubtitle}>Choose 3 prompts to answer</Text>
          <Text style={styles.progressText}>
            {selectedPrompts.length} of 3 prompts selected
          </Text>
          
          {promptOptions.map((prompt, index) => (
            <View key={index} style={styles.promptContainer}>
              <TouchableOpacity
                style={[
                  styles.promptSelector,
                  selectedPrompts.includes(prompt) && styles.selectedPrompt
                ]}
                onPress={() => togglePrompt(prompt)}
              >
                <Text style={styles.promptText}>{prompt}</Text>
                {selectedPrompts.includes(prompt) && (
                  <Check size={16} color="#8EC6DB" strokeWidth={2} />
                )}
              </TouchableOpacity>
              
              {selectedPrompts.includes(prompt) && (
                <TextInput
                  style={styles.promptInput}
                  placeholder="Write your answer here..."
                  value={promptAnswers[prompt] || ''}
                  onChangeText={(text) => 
                    setPromptAnswers({...promptAnswers, [prompt]: text})
                  }
                  multiline
                  maxLength={300}
                />
              )}
            </View>
          ))}
        </View>

        {/* Dream Dog Date Bio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Describe Your Dream First Date</Text>
          <TextInput
            style={styles.bioInput}
            placeholder="We'd meet at the shelter, pick a pup, then walk to a dog café and share treats while getting to know each other."
            value={dreamDateBio}
            onChangeText={setDreamDateBio}
            multiline
            maxLength={300}
          />
          <Text style={styles.charCount}>
            {dreamDateBio.length}/300 characters (minimum 50)
          </Text>
        </View>

        {/* Lifestyle & Values Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tag Your Values & Vibe</Text>
          <Text style={styles.sectionSubtitle}>Choose 3-5 tags that describe you</Text>
          <Text style={styles.progressText}>
            {selectedTags.length} of 5 tags selected
          </Text>
          
          <View style={styles.tagsGrid}>
            {mockTags.map((tag) => (
              <TouchableOpacity
                key={tag.id}
                style={[
                  styles.tag,
                  selectedTags.includes(tag.id) && styles.selectedTag
                ]}
                onPress={() => toggleTag(tag.id)}
              >
                <Text
                  style={[
                    styles.tagText,
                    selectedTags.includes(tag.id) && styles.selectedTagText
                  ]}
                >
                  {tag.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Pet & Dog Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Dog Situation</Text>
          
          <View style={styles.radioGroup}>
            <Text style={styles.radioLabel}>Do you have a dog?</Text>
            {['Yes', 'No', 'Sometimes'].map((option) => (
              <TouchableOpacity
                key={option}
                style={styles.radioOption}
                onPress={() => setHasDog(option)}
              >
                <View style={[
                  styles.radioCircle,
                  hasDog === option && styles.radioSelected
                ]}>
                  {hasDog === option && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.checkboxGroup}>
            <TouchableOpacity 
              style={styles.checkboxOption}
              onPress={() => setIsVolunteer(!isVolunteer)}
            >
              <View style={[
                styles.checkbox,
                isVolunteer && styles.checkboxSelected
              ]}>
                {isVolunteer && <Check size={12} color="white" strokeWidth={2} />}
              </View>
              <Text style={styles.checkboxText}>I volunteer at shelters</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.checkboxOption}
              onPress={() => setConsideringAdoption(!consideringAdoption)}
            >
              <View style={[
                styles.checkbox,
                consideringAdoption && styles.checkboxSelected
              ]}>
                {consideringAdoption && <Check size={12} color="white" strokeWidth={2} />}
              </View>
              <Text style={styles.checkboxText}>I'm considering adoption</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.preferencesGroup}>
            <Text style={styles.preferenceLabel}>Preferred dog energy:</Text>
            <View style={styles.preferenceOptions}>
              {['Low', 'Medium', 'High', 'Any'].map((energy) => (
                <TouchableOpacity
                  key={energy}
                  style={[
                    styles.preferenceOption,
                    preferredEnergy === energy && styles.selectedPreference
                  ]}
                  onPress={() => setPreferredEnergy(energy)}
                >
                  <Text style={[
                    styles.preferenceText,
                    preferredEnergy === energy && styles.selectedPreferenceText
                  ]}>
                    {energy}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.preferenceLabel}>Preferred dog size:</Text>
            <View style={styles.preferenceOptions}>
              {['Small', 'Medium', 'Large', 'Any'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.preferenceOption,
                    preferredSize === size && styles.selectedPreference
                  ]}
                  onPress={() => setPreferredSize(size)}
                >
                  <Text style={[
                    styles.preferenceText,
                    preferredSize === size && styles.selectedPreferenceText
                  ]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Submit Button */}
        <View style={styles.submitSection}>
          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.8}
          >
            <Text style={styles.submitButtonText}>Save My Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F0',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  completionTracker: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  completionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444B5A',
    marginBottom: 12,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#7AC79E',
    borderRadius: 4,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#444B5A',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#B5C1B6',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#8EC6DB',
    fontWeight: '600',
    marginBottom: 16,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  avatarOption: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedAvatar: {
    borderColor: '#8EC6DB',
    backgroundColor: '#F0F8FF',
  },
  avatarEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  avatarName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444B5A',
    marginBottom: 2,
  },
  avatarTrait: {
    fontSize: 10,
    color: '#B5C1B6',
    textAlign: 'center',
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8EC6DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptContainer: {
    marginBottom: 16,
  },
  promptSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  selectedPrompt: {
    backgroundColor: '#F0F8FF',
    borderWidth: 2,
    borderColor: '#8EC6DB',
  },
  promptText: {
    fontSize: 14,
    color: '#444B5A',
    flex: 1,
  },
  promptInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#444B5A',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#444B5A',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    color: '#B5C1B6',
    textAlign: 'right',
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTag: {
    backgroundColor: '#8EC6DB',
    borderColor: '#8EC6DB',
  },
  tagText: {
    fontSize: 12,
    color: '#444B5A',
    fontWeight: '600',
  },
  selectedTagText: {
    color: 'white',
  },
  radioGroup: {
    marginBottom: 20,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444B5A',
    marginBottom: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioSelected: {
    borderColor: '#8EC6DB',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8EC6DB',
  },
  radioText: {
    fontSize: 14,
    color: '#444B5A',
  },
  checkboxGroup: {
    marginBottom: 20,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: '#8EC6DB',
    borderColor: '#8EC6DB',
  },
  checkboxText: {
    fontSize: 14,
    color: '#444B5A',
  },
  preferencesGroup: {
    gap: 12,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444B5A',
    marginBottom: 8,
  },
  preferenceOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  preferenceOption: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPreference: {
    backgroundColor: '#8EC6DB',
    borderColor: '#8EC6DB',
  },
  preferenceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444B5A',
  },
  selectedPreferenceText: {
    color: 'white',
  },
  submitSection: {
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: '#F86F6F',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});