import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import {
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  Inter_400Regular,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'PlayfairDisplay-Bold': PlayfairDisplay_700Bold,
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // For demo purposes, we'll use a simple state
  // In production, this should persist using AsyncStorage
  useEffect(() => {
    // Simulate checking onboarding status
    // In real app: AsyncStorage.getItem('onboardingComplete')
    setOnboardingComplete(false);
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (authLoading || (user && profileLoading)) {
    return null;
  }

  // Show onboarding if not completed
  if (!onboardingComplete) {
    return (
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen 
            name="(onboarding)" 
            options={{ headerShown: false }}
            initialParams={{ setOnboardingComplete }}
          />
        </Stack>
        <StatusBar style="auto" />
      </>
    );
  }

  // Show auth flow if not authenticated
  if (!user) {
    return (
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </>
    );
  }

  // Show profile setup if authenticated but profile not complete
  if (user && profile && !profile.profile_complete) {
    return (
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(profile-setup)" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="auto" />
      </>
    );
  }

  // Show main app if authenticated and profile complete
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}