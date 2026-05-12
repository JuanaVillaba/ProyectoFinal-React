import { Stack } from 'expo-router';

/**
 * Stack navigator para la sección Incidencias.
 *
 * RUTAS:
 *   index   → listado de incidencias       /(tabs)/incidencia
 *   nueva   → formulario nueva incidencia  /(tabs)/incidencia/nueva
 *
 * ⚠️  Sin este archivo, Expo Router no sabe que `incidencia/` es un Stack,
 *     y termina mostrando solo la última ruta que coincide (nueva.tsx).
 */
export default function IncidenciaLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="nueva"
        options={{
          presentation: 'modal',   // sube desde abajo en iOS, slide en Android
          animation:    'slide_from_bottom',
        }}
      />
    </Stack>
  );
}
