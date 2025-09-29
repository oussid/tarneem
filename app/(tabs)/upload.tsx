// app/(tabs)/upload.tsx
import { useState } from 'react';
import { Button, View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { auth } from '@/firebase';
import { Ionicons } from '@expo/vector-icons';

export default function UploadScreen() {
  const [track, setTrack] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickAudio = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*', // This allows picking any audio file
    });

    if (!result.canceled && result.assets) {
      setTrack(result.assets[0]);
    }
  };

  const uploadAudio = async () => {
    if (!track) return;
    setUploading(true);
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "You must be logged in to upload audio.");
      setUploading(false);
      return;
    }

    try {
      const response = await fetch(track.uri);
      const blob = await response.blob();
      const storage = getStorage();
      // Store all audio in a user-specific folder
      const filename = `uploads/${user.uid}/audio/${track.name}`;
      const storageRef = ref(storage, filename);
      
      await uploadBytes(storageRef, blob);
      
      const downloadUrl = await getDownloadURL(storageRef);
      console.log("File available at", downloadUrl);

      setUploading(false);
      Alert.alert('Upload successful!', `${track.name} has been uploaded.`);
      setTrack(null);
    } catch (error) {
      console.error(error);
      setUploading(false);
      Alert.alert('Upload failed', 'There was an error uploading your audio file.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Upload Audio</ThemedText>
      <ThemedText style={styles.subtitle}>Select a hymn or podcast to upload</ThemedText>
      <Button title="Pick an audio file" onPress={pickAudio} />
      {track && (
        <ThemedView style={styles.trackContainer}>
            <Ionicons name="musical-notes" size={32} color="#888" />
            <ThemedText style={styles.trackName} numberOfLines={1}>{track.name}</ThemedText>
            {uploading ? (
                <ActivityIndicator size="large" color="#0a7ea4" />
            ) : (
                <Button title="Upload Track" onPress={uploadAudio} />
            )}
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        padding: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    trackContainer: {
        alignItems: 'center',
        gap: 20,
        marginTop: 30,
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
    trackName: {
        fontSize: 18,
    },
});