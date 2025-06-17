import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to sign-in screen
    router.replace('/sign-in');
  }, []);

  // Return empty view while redirecting
  return <View />;
}