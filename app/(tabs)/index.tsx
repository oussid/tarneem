// app/(tabs)/index.tsx

import { Image } from 'expo-image';
import { StyleSheet, Button, View } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/firebase';
import { signOut } from 'firebase/auth';

export default function HomeScreen() {
  const handleSignOut = () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to Tarneem!</ThemedText>
      </ThemedView>
      <View style={styles.stepContainer}>
        <ThemedText>
          You are logged in as: {auth.currentUser?.email}
        </ThemedText>
        <Button title="Sign Out" onPress={handleSignOut} />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});