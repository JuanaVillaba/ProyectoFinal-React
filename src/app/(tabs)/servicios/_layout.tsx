import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function ServiciosLayout() {
  return (
    <SafeAreaProvider>
        
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="servicios" options={{ headerShown: true, title: "Servicios" }} />
        
      </Stack>
    </SafeAreaProvider>
  );
}