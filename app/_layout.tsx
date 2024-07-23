import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store'
import { useEffect } from 'react';
import 'react-native-reanimated';

const CLERK_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY

const tokenCache = {
  getToken: async (key: string) => {
    try {
      return SecureStore.getItemAsync(key);
    } catch (error) {
      return null;
    }
  },
  saveToken: async (key: string, value: string) => {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (error) {
      return;
    }
  },
}

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    if(!isLoaded) return

    const inTabGroup = segments[0] === '(auth)'

    if(isSignedIn && !inTabGroup) {
      router.replace('/home')
    } else if (!isSignedIn){
      router.replace('/login')
    }

  }, [isSignedIn]);


  return <Slot />
}

export default function RootLayoutNav() {

  return (
      <ClerkProvider publishableKey={CLERK_KEY!} tokenCache={tokenCache}>
        <InitialLayout/>
      </ClerkProvider>
  );
}
