import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Tabs */}
        <Stack.Screen name="(tabs)" />

        {/* Rutas fuera de tabs */}
        <Stack.Screen name="incidencia/[id]" options={{ headerShown: true, title: 'Detalle' }} />
        <Stack.Screen name="incidencia/crear" options={{ headerShown: true, title: 'Nueva incidencia' }} />
      </Stack>
    </SafeAreaProvider>
  );
}