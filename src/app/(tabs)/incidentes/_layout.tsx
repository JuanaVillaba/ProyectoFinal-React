import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function NewReporteLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="incidentes" options={{ headerShown: true, title: 'Nueva incidencia' }} />

      </Stack>
    </SafeAreaProvider>
  );
}