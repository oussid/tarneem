// components/AudioPlayerUI.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { useAudioPlayer } from '@/services/AudioPlayerContext';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme'; // 1. Import the hook
import { Colors } from '@/constants/colors';               // 2. Import your Colors object

const AudioPlayerUI = () => {
  const { isPlaying, currentTrack, pauseTrack, resumeTrack } = useAudioPlayer();
  const colorScheme = useColorScheme(); // 3. Get the current color scheme ('light' or 'dark')

  // 4. Determine the icon color based on the theme
  const iconColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;

  // Don't render anything if no track is loaded
  if (!currentTrack) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.trackInfo}>
        <ThemedText type="defaultSemiBold">{currentTrack.title}</ThemedText>
        <ThemedText style={styles.artistText}>{currentTrack.artist}</ThemedText>
      </View>
      <View>
        {isPlaying ? (
          <Ionicons.Button
            name="pause"
            size={32}
            onPress={pauseTrack}
            backgroundColor="transparent"
            underlayColor="#333"
            color={iconColor} // 5. Apply the dynamic color
          />
        ) : (
          <Ionicons.Button
            name="play"
            size={32}
            onPress={resumeTrack}
            backgroundColor="transparent"
            underlayColor="#333"
            color={iconColor} // 5. Apply the dynamic color
          />
        )}
      </View>
    </ThemedView>
  );
};

export default AudioPlayerUI;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 49, // Adjusted slightly for better alignment with the tab bar
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  trackInfo: {
    flex: 1,
  },
  artistText: {
    color: '#888',
    fontSize: 12,
  },
});