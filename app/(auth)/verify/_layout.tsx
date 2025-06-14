import { Stack } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';

export default function VerifyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="intro" options={{ headerShown: false }} />
      <Stack.Screen name="id-scan" options={{ headerShown: false }} />
      <Stack.Screen name="selfie-video" options={{ headerShown: false }} />
      <Stack.Screen name="in-review" options={{ headerShown: false }} />
      <Stack.Screen name="waiting" options={{ headerShown: false }} />
    </Stack>
  );
}