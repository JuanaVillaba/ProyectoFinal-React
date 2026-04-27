import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
    </Stack>
  );
}