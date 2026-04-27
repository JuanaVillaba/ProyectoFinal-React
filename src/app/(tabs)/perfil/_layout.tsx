import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function PerfilLayout() {
  return (
    <SafeAreaProvider>
        
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="perfil" options={{ headerShown: true, title: "Perfil" }} />
        
      </Stack>
    </SafeAreaProvider>
  );
}