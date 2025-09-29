// components/AudioPlayerUI.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { useAudioPlayer } from '@/services/AudioPlayerContext';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/colors';
import Slider from '@react-native-community/slider';

const formatTime = (millis: number) => {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const AudioPlayerUI = () => {
  const { 
      isPlaying, 
      currentTrack, 
      pauseTrack, 
      resumeTrack, 
      playbackStatus, 
      seekTrack,
      repeatMode,
      toggleRepeatMode,
    } = useAudioPlayer();
  const colorScheme = useColorScheme();
  const iconColor = colorScheme === 'dark' ? Colors.dark.icon : Colors.light.icon;
  const activeIconColor = colorScheme === 'dark' ? Colors.dark.tint : Colors.light.tint;
  const trackColor = colorScheme === 'dark' ? '#fff' : '#000';
  const thumbColor = colorScheme === 'dark' ? '#fff' : '#0a7ea4';

  if (!currentTrack) return null;

  return (
    <ThemedView style={styles.container}>
        <View style={styles.topSection}>
            <View style={styles.trackInfo}>
                <ThemedText type="defaultSemiBold" numberOfLines={1}>{currentTrack.title}</ThemedText>
                <ThemedText style={styles.artistText} numberOfLines={1}>{currentTrack.artist}</ThemedText>
            </View>
            <View style={styles.controls}>
                {/* --- REPEAT BUTTON --- */}
                <Ionicons.Button
                    name="repeat"
                    size={24}
                    onPress={toggleRepeatMode}
                    backgroundColor="transparent"
                    underlayColor="#333"
                    color={repeatMode === 'track' ? activeIconColor : iconColor}
                />
                {/* -------------------- */}
                {isPlaying ? (
                <Ionicons.Button
                    name="pause"
                    size={32}
                    onPress={pauseTrack}
                    backgroundColor="transparent"
                    underlayColor="#333"
                    color={iconColor}
                />
                ) : (
                <Ionicons.Button
                    name="play"
                    size={32}
                    onPress={resumeTrack}
                    backgroundColor="transparent"
                    underlayColor="#333"
                    color={iconColor}
                />
                )}
            </View>
        </View>

        <View style={styles.bottomSection}>
            <ThemedText style={styles.timeText}>{formatTime(playbackStatus.position)}</ThemedText>
            <Slider
                style={styles.slider}
                value={playbackStatus.position}
                minimumValue={0}
                maximumValue={playbackStatus.duration}
                onSlidingComplete={seekTrack}
                minimumTrackTintColor={trackColor}
                maximumTrackTintColor="#888"
                thumbTintColor={thumbColor}
            />
            <ThemedText style={styles.timeText}>{formatTime(playbackStatus.duration)}</ThemedText>
        </View>
    </ThemedView>
  );
};

export default AudioPlayerUI;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 49,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    gap: 8,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  trackInfo: {
    flex: 1,
    marginRight: 10,
  },
  artistText: {
    color: '#888',
    fontSize: 12,
  },
  slider: {
    flex: 1,
  },
  timeText: {
    fontSize: 12,
    width: 40,
    textAlign: 'center',
  },
  controls: {
      flexDirection: 'row',
      alignItems: 'center',
  }
});