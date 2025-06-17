import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Mail, Lock, Calendar, MapPin } from 'lucide-react-native';

export default function InitialProfileSetupScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  // Error states for inline validation
  const [firstNameError, setFirstNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [cityError, setCityError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinue = async () => {
    // Clear previous errors
    setFirstNameError('');
    setEmailError('');
    setPasswordError('');
    setAgeError('');
    setCityError('');

    let hasErrors = false;

    // Validate first name
    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      hasErrors = true;
    } else if (firstName.trim().length < 2) {
      setFirstNameError('First name must be at least 2 characters');
      hasErrors = true;
    }

    // Validate email
    if (!email.trim()) {
      setEmailError('Email address is required');
      hasErrors = true;
    } else if (!validateEmail(email.trim())) {
      setEmailError('Please enter a valid email address');
      hasErrors = true;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasErrors = true;
    }

    // Validate age
    if (!age.trim()) {
      setAgeError('Age is required');
      hasErrors = true;
    } else {
      const ageNum = parseInt(age);
      if (isNaN(ageNum)) {
        setAgeError('Please enter a valid number');
        hasErrors = true;
      } else if (ageNum < 18) {
        setAgeError('You must be at least 18 years old');
        hasErrors = true;
      } else if (ageNum > 100) {
        setAgeError('Please enter a valid age');
        hasErrors = true;
      }
    }

    // Validate city
    if (!city.trim()) {
      setCityError('City is required');
      hasErrors = true;
    } else if (city.trim().length < 2) {
      setCityError('Please enter a valid city name');
      hasErrors = true;
    }

    // If there are validation errors, don't proceed
    if (hasErrors) {
      return;
    }

    setLoading(true);
    try {
      // Simulate account creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Navigate to verification intro
      router.push('/(verification)/intro');
    } catch (error: any) {
      setEmailError('Account creation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Check if form is valid for button state
  const isFormValid = () => {
    return firstName.trim().length >= 2 && 
           validateEmail(email.trim()) && 
           password.length >= 6 && 
           age.trim() && 
           !isNaN(parseInt(age)) && 
           parseInt(age) >= 18 && 
           parseInt(age) <= 100 &&
           city.trim().length >= 2 &&
           !firstNameError && 
           !emailError && 
           !passwordError && 
           !ageError &&
           !cityError;
  };

  return (
    <LinearGradient
      colors={['#E8F5E8', '#F0F8FF', '#FFF8F0']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
              >
                <ChevronLeft size={24} color="#444B5A" strokeWidth={2} />
              </TouchableOpacity>
              
              <Text style={styles.headerTitle}>Create Your Account</Text>
            </View>

            <View style={styles.content}>
              <View style={styles.titleSection}>
                <Text style={styles.title}>Let's Get to Know You!</Text>
                <Text style={styles.subtitle}>
                  Just a few quick details to create your PuppyLove account
                </Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <View style={styles.inputHeader}>
                    <User size={20} color="#7AC79E" strokeWidth={2} />
                    <Text style={styles.inputLabel}>First Name</Text>
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      firstNameError ? styles.inputError : null
                    ]}
                    placeholder="Enter your first name"
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                      if (firstNameError) setFirstNameError('');
                    }}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                  {firstNameError ? (
                    <Text style={styles.errorText}>{firstNameError}</Text>
                  ) : null}
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputHeader}>
                    <Mail size={20} color="#8EC6DB" strokeWidth={2} />
                    <Text style={styles.inputLabel}>Email Address</Text>
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      emailError ? styles.inputError : null
                    ]}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (emailError) setEmailError('');
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {emailError ? (
                    <Text style={styles.errorText}>{emailError}</Text>
                  ) : null}
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputHeader}>
                    <Lock size={20} color="#F86F6F" strokeWidth={2} />
                    <Text style={styles.inputLabel}>Password</Text>
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      passwordError ? styles.inputError : null
                    ]}
                    placeholder="Create a secure password"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (passwordError) setPasswordError('');
                    }}
                    secureTextEntry
                  />
                  {passwordError ? (
                    <Text style={styles.errorText}>{passwordError}</Text>
                  ) : (
                    <Text style={styles.passwordHint}>
                      Must be at least 6 characters
                    </Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputHeader}>
                    <Calendar size={20} color="#FBBF77" strokeWidth={2} />
                    <Text style={styles.inputLabel}>Age</Text>
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      ageError ? styles.inputError : null
                    ]}
                    placeholder="Enter your age"
                    value={age}
                    onChangeText={(text) => {
                      setAge(text);
                      if (ageError) setAgeError('');
                    }}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                  {ageError ? (
                    <Text style={styles.errorText}>{ageError}</Text>
                  ) : (
                    <Text style={styles.ageHint}>
                      Must be 18 or older to join PuppyLove
                    </Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <View style={styles.inputHeader}>
                    <MapPin size={20} color="#B794F6" strokeWidth={2} />
                    <Text style={styles.inputLabel}>City</Text>
                  </View>
                  <TextInput
                    style={[
                      styles.input,
                      cityError ? styles.inputError : null
                    ]}
                    placeholder="Enter your city"
                    value={city}
                    onChangeText={(text) => {
                      setCity(text);
                      if (cityError) setCityError('');
                    }}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                  {cityError ? (
                    <Text style={styles.errorText}>{cityError}</Text>
                  ) : (
                    <Text style={styles.cityHint}>
                      We'll help you find local shelters and dog dates nearby
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.continueButton, 
                    (loading || !isFormValid()) && styles.buttonDisabled
                  ]}
                  onPress={handleContinue}
                  disabled={loading || !isFormValid()}
                  activeOpacity={0.8}
                >
                  <Text style={styles.continueButtonText}>
                    {loading ? 'Creating Account...' : 'Continue to Verification'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.privacyNote}>
                <Text style={styles.privacyText}>
                  🔒 Your information is secure and will only be used to create your PuppyLove profile. 
                  We'll verify your identity next to keep our community safe.
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
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
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#444B5A',
  },
  content: {
    flex: 1,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 40,
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
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#444B5A',
    marginLeft: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#444B5A',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputError: {
    borderColor: '#F86F6F',
    backgroundColor: '#FFF8F8',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#F86F6F',
    marginTop: 4,
    marginLeft: 4,
  },
  passwordHint: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 4,
  },
  ageHint: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 4,
  },
  cityHint: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginLeft: 4,
  },
  continueButton: {
    backgroundColor: '#F86F6F',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#F86F6F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#B5C1B6',
    shadowColor: '#B5C1B6',
  },
  continueButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    fontSize: 18,
  },
  privacyNote: {
    backgroundColor: 'rgba(122, 199, 158, 0.1)',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#7AC79E',
  },
  privacyText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#444B5A',
    lineHeight: 20,
    textAlign: 'center',
  },
});