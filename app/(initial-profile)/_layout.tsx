import { Stack } from 'expo-router';

export default function InitialProfileLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="setup" options={{ headerShown: false }} />
    </Stack>
  );
}