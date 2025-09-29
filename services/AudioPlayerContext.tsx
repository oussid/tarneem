// services/AudioPlayerContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
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

type RepeatMode = 'off' | 'track' | 'playlist'; // Added 'playlist' repeat mode

interface AudioContextType {
  isPlaying: boolean;
  currentTrack: AudioTrack | null;
  playbackStatus: PlaybackStatus;
  repeatMode: RepeatMode;
  loadPlaylist: (playlist: AudioTrack[], startIndex?: number) => void;
  playNextTrack: () => void;
  playPreviousTrack: () => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  seekTrack: (position: number) => void;
  toggleRepeatMode: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const [sound, setSound] = useState<Sound | null>(null);
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [playlist, setPlaylist] = useState<AudioTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('off');
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

      if (status.didJustFinish && !status.isLooping) {
        if (repeatMode === 'playlist') {
          playNextTrack(true); // true indicates it's an auto-play
        } else {
          setPlaybackStatus({ position: 0, duration: status.durationMillis || 0, isPlaying: false });
        }
      }
    } else {
      if (status.error) console.error(`Playback Error: ${status.error}`);
      setPlaybackStatus({ position: 0, duration: 0, isPlaying: false });
    }
  };
  
  async function playTrack(track: AudioTrack, index: number) {
    if (sound) await sound.unloadAsync();
    setCurrentTrack(track);
    setCurrentTrackIndex(index);
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: track.uri },
        { shouldPlay: true, isLooping: repeatMode === 'track' },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
    } catch (error) {
      console.error("Error loading track:", error);
      setCurrentTrack(null);
    }
  }

  function loadPlaylist(newPlaylist: AudioTrack[], startIndex = 0) {
    setPlaylist(newPlaylist);
    playTrack(newPlaylist[startIndex], startIndex);
  }
  
  function playNextTrack(isAutoPlay = false) {
    if (playlist.length === 0 || currentTrackIndex === null) return;
    let nextIndex = currentTrackIndex + 1;
    // If it's the end of the playlist
    if (nextIndex >= playlist.length) {
      if (repeatMode === 'playlist') {
        nextIndex = 0; // Loop back to the start
      } else {
        // If not repeating playlist, stop unless it's a manual skip
        if (isAutoPlay) {
            setCurrentTrack(null);
            return;
        }
        nextIndex = 0; // Manual skip goes to first track
      }
    }
    playTrack(playlist[nextIndex], nextIndex);
  }

  function playPreviousTrack() {
    if (playlist.length === 0 || currentTrackIndex === null) return;
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) {
      prevIndex = playlist.length - 1; // Go to the end of the list
    }
    playTrack(playlist[prevIndex], prevIndex);
  }

  const toggleRepeatMode = () => {
    setRepeatMode(prev => {
        if (prev === 'off') return 'track';
        if (prev === 'track') return 'playlist';
        return 'off';
    });
  };

  useEffect(() => {
    if (sound) {
      sound.setIsLoopingAsync(repeatMode === 'track');
    }
  }, [repeatMode, sound]);

  async function pauseTrack() { if (sound) await sound.pauseAsync(); }
  async function resumeTrack() { if (sound) await sound.playAsync(); }
  async function seekTrack(position: number) { if (sound) await sound.setPositionAsync(position); }
  
  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  return (
    <AudioContext.Provider value={{
      isPlaying: playbackStatus.isPlaying,
      currentTrack,
      playbackStatus,
      repeatMode,
      loadPlaylist,
      playNextTrack,
      playPreviousTrack,
      pauseTrack,
      resumeTrack,
      seekTrack,
      toggleRepeatMode,
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