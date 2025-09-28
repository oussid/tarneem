// app/signup.tsx

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { auth } from '@/firebase'; // Using alias from tsconfig.json
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

const SignUpScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Registered with:', user.email);
        router.replace('/(tabs)'); // Navigate to home screen on success
      })
      .catch(error => Alert.alert('Sign Up Error', error.message));
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Create Account</ThemedText>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        style={styles.input}
        autoCapitalize="none"
        placeholderTextColor="#888"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#888"
      />
      <View style={styles.buttonContainer}>
        <Button title="Sign Up" onPress={handleSignUp} />
        <Link href="/login" asChild>
          <Button title="Have an account? Login" />
        </Link>
      </View>
    </ThemedView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, gap: 16 },
    input: {
      width: '100%',
      marginVertical: 4,
      padding: 15,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
      color: '#fff' // Assuming dark mode, adjust if needed
    },
    buttonContainer: {
      marginTop: 10,
      gap: 10,
      width: '100%',
    }
  });