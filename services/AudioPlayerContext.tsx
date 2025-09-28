// services/AudioPlayerContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

// Define the shape of our audio item
export interface AudioTrack {
  id: string;
  uri: string;
  title: string;
  artist: string;
}

// Define the shape of our context state
interface AudioContextType {
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
}

// Create the context
const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Create the provider component
export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [sound, setSound] = useState<Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);

  useEffect(() => {
    // Configure audio session for background playback
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  async function playTrack(track: AudioTrack) {
    if (sound) {
      await sound.unloadAsync();
    }

    if (track.uri) {
        try {
            const { sound: newSound } = await Audio.Sound.createAsync(
                { uri: track.uri },
                { shouldPlay: true }
            );
            setSound(newSound);
            setIsPlaying(true);
            setCurrentTrack(track);
        } catch (error) {
            console.error("Error loading track:", error);
        }
    }
  }

  async function pauseTrack() {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }

  async function resumeTrack() {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  }

  // Unload sound when component unmounts
  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <AudioContext.Provider value={{ isPlaying, currentTrack, playTrack, pauseTrack, resumeTrack }}>
      {children}
    </AudioContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useAudioPlayer = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};