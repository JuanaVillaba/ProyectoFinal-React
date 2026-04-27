import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Screen from '@/components/ui/Screen';
import IncidenciaCard from '@/components/incidencia/IncidenciaCard';
import { incidenciasMock } from '@/features/incidencias/mock';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

export default function IncidenciasScreen() {
  const router = useRouter();

  return (
    <Screen>
      <FlatList
        data={incidenciasMock}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <IncidenciaCard {...item} />}
      />

      {/* Botón flotante */}
      <Pressable
        style={styles.fab}
        onPress={() => router.push('/incidencia/crear')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3b82f6',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
});