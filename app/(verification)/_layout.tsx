import { Stack } from 'expo-router';

export default function VerificationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="intro" options={{ headerShown: false }} />
      <Stack.Screen name="id-scan" options={{ headerShown: false }} />
      <Stack.Screen name="selfie-video" options={{ headerShown: false }} />
      <Stack.Screen name="in-review" options={{ headerShown: false }} />
    </Stack>
  );
}