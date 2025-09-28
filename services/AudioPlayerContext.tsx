// services/AudioPlayerContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av'; // Corrected Import
import { Sound } from 'expo-av/build/Audio';

export interface AudioTrack {
  id: string;
  uri: string;
  title: string;
  artist: string;
  duration?: number;
}

interface PlaybackStatus {
  position: number;
  duration: number;
  isPlaying: boolean;
}

interface AudioContextType {
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  playbackStatus: PlaybackStatus;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  seekTrack: (position: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [sound, setSound] = useState<Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [playbackStatus, setPlaybackStatus] = useState<PlaybackStatus>({
    position: 0,
    duration: 0,
    isPlaying: false,
  });

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);
  
  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setPlaybackStatus({
        position: status.positionMillis,
        duration: status.durationMillis || 0,
        isPlaying: status.isPlaying,
      });
    } else {
        if (status.error) {
            console.error(`Playback Error: ${status.error}`);
        }
        setPlaybackStatus({ position: 0, duration: 0, isPlaying: false });
    }
  };

  async function playTrack(track: AudioTrack) {
    if (sound) {
      await sound.unloadAsync();
    }
    setCurrentTrack(track);
    
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
    } catch (error) {
      console.error("Error loading track:", error);
      setCurrentTrack(null);
    }
  }

  async function pauseTrack() {
    if (sound) {
      await sound.pauseAsync();
    }
  }

  async function resumeTrack() {
    if (sound) {
      await sound.playAsync();
    }
  }

  async function seekTrack(position: number) {
    if (sound) {
        await sound.setPositionAsync(position);
    }
  }
  
  useEffect(() => {
    return sound
      ? () => { sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  return (
    <AudioContext.Provider value={{
      isPlaying: playbackStatus.isPlaying,
      currentTrack,
      playbackStatus,
      playTrack,
      pauseTrack,
      resumeTrack,
      seekTrack,
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};