// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/tab-bar-icon';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import AudioPlayerUI from '@/components/AudioPlayerUI';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'musical-notes' : 'musical-notes-outline'} color={color} />
            ),
          }}
        />
        {/* --- ADD THIS NEW SCREEN --- */}
        <Tabs.Screen
          name="upload"
          options={{
            title: 'Upload',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'cloud-upload' : 'cloud-upload-outline'} color={color} />
            ),
          }}
        />
        {/* ------------------------- */}
      </Tabs>
      <AudioPlayerUI />
    </>
  );
}