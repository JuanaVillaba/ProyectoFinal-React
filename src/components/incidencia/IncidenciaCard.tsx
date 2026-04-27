import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import EstadoBadge from './EstadoBadge';
import { useRouter } from 'expo-router';

type Props = {
  id: string;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en_proceso' | 'resuelto';
  fecha: string;
};

export default function IncidenciaCard({
  id,
  titulo,
  descripcion,
  estado,
  fecha,
}: Props) {
  const router = useRouter();

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/incidencia/${id}`)}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{titulo}</Text>
        <EstadoBadge estado={estado} />
      </View>

      <Text style={styles.desc}>{descripcion}</Text>
      <Text style={styles.date}>{fecha}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
  },
  desc: {
    marginTop: 5,
    color: '#555',
  },
  date: {
    marginTop: 5,
    fontSize: 12,
    color: '#999',
  },
});