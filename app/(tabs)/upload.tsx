// app/(tabs)/upload.tsx
import { useState } from 'react';
import { Button, Image, View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { auth } from '@/firebase';

export default function UploadScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return;
    setUploading(true);
    const user = auth.currentUser;
    if (!user) {
        Alert.alert("Error", "You must be logged in to upload images.");
        setUploading(false);
        return;
    }

    try {
        const response = await fetch(image);
        const blob = await response.blob();
        const storage = getStorage();
        // Create a unique filename
        const filename = `uploads/${user.uid}/${Date.now()}`;
        const storageRef = ref(storage, filename);

        await uploadBytes(storageRef, blob);

        const downloadUrl = await getDownloadURL(storageRef);
        console.log("File available at", downloadUrl);

        setUploading(false);
        Alert.alert('Upload successful!', 'Your image has been uploaded.');
        setImage(null);
    } catch (error) {
        console.error(error);
        setUploading(false);
        Alert.alert('Upload failed', 'There was an error uploading your image.');
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Upload Content</ThemedText>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            {uploading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Button title="Upload Image" onPress={uploadImage} />
            )}
        </View>
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
    },
    imageContainer: {
        alignItems: 'center',
        gap: 20,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
});