import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function IniciarSesionLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        
        <Stack.Screen name="iniciar-sesion" options={{ headerShown: true, title: 'Registro' }} />

      </Stack>
    </SafeAreaProvider>
  );
}