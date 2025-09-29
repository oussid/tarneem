// app/(tabs)/explore.tsx
import { StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAudioPlayer, AudioTrack } from '@/services/AudioPlayerContext';

const sampleTracks: AudioTrack[] = [
  {
    id: '1',
    uri: 'https://archive.org/download/HearYeHim/HYH060_TheHeavenlyKingdom.mp3',
    title: 'Great Is Thy Faithfulness',
    artist: 'Gospel Hymn',
  },
  {
    id: '2',
    uri: 'https://archive.org/download/HearYeHim/HYH060_TheHeavenlyKingdom.mp3',
    title: 'Amazing Grace',
    artist: 'Gospel Hymn',
  },
  {
    id: '3',
    uri: 'https://archive.org/download/HearYeHim/HYH060_TheHeavenlyKingdom.mp3',
    title: 'Holy Night',
    artist: 'Gospel Hymn',
  }
];

export default function ExploreScreen() {
    const { loadPlaylist, currentTrack } = useAudioPlayer();

    const handleTrackSelect = (track: AudioTrack, index: number) => {
        // Load the entire playlist, starting at the selected track's index
        loadPlaylist(sampleTracks, index);
    };

    const renderItem = ({ item, index }: { item: AudioTrack, index: number }) => (
        <TouchableOpacity onPress={() => handleTrackSelect(item, index)} style={styles.trackItem}>
            <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
            <ThemedText style={styles.artistText}>{item.artist}</ThemedText>
            {currentTrack?.id === item.id && <ThemedText style={styles.playingText}>Now Playing</ThemedText>}
        </TouchableOpacity>
    );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Music & Podcasts</ThemedText>
      <FlatList
        data={sampleTracks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  trackItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  artistText: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  playingText: {
    color: '#1e90ff',
    fontSize: 12,
    marginTop: 4,
  }
});