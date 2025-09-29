// app/(tabs)/library.tsx
import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAudioPlayer, AudioTrack } from '@/services/AudioPlayerContext';
import { useEffect, useState, useCallback } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';
import { auth } from '@/firebase';

export default function LibraryScreen() {
  const { loadPlaylist, currentTrack } = useAudioPlayer();
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTracks = useCallback(async () => {
    const user = auth.currentUser;
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const storage = getStorage();
      const listRef = ref(storage, `uploads/${user.uid}/audio`);
      const res = await listAll(listRef);

      const tracksWithUrls = await Promise.all(
        res.items.map(async (itemRef, index) => {
          const downloadURL = await getDownloadURL(itemRef);
          return {
            id: `${index}-${itemRef.name}`, // Create a unique ID
            uri: downloadURL,
            title: itemRef.name.replace('.mp3', '').replace('.m4a', ''), // Clean up the name
            artist: user.email || 'Uploaded',
          };
        })
      );
      setTracks(tracksWithUrls);
    } catch (error) {
      console.error("Error fetching tracks:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTracks();
  }, [fetchTracks]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTracks();
  };

  if (loading) {
    return <ThemedView style={styles.center}><ActivityIndicator /></ThemedView>;
  }

  const handleTrackSelect = (track: AudioTrack, index: number) => {
    loadPlaylist(tracks, index);
  };

  const renderItem = ({ item, index }: { item: AudioTrack, index: number }) => (
      <TouchableOpacity onPress={() => handleTrackSelect(item, index)} style={styles.trackItem}>
          <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
          <ThemedText style={styles.artistText}>{item.artist}</ThemedText>
          {currentTrack?.uri === item.uri && <ThemedText style={styles.playingText}>Now Playing</ThemedText>}
      </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">My Library</ThemedText>
      {tracks.length === 0 ? (
        <ThemedView style={styles.center}>
            <ThemedText>You haven't uploaded any tracks yet.</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
            data={tracks}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  trackItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  artistText: { color: '#888', fontSize: 14, marginTop: 4, },
  playingText: { color: '#1e90ff', fontSize: 12, marginTop: 4, }
});