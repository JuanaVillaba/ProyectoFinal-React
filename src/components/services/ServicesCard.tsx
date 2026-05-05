import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Servicio = {
    id: number;
    icon: string;
    nameService: string;
    estado: string;
    nextMaintenance: string;
    iconColor: string;
};

type Props = {
  servicio: Servicio;
  onPress: () => void;
};

export default function ServiceCard({ servicio, onPress }: Props) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.row}>
        <Ionicons name={servicio.icon as any} size={28} color={servicio.iconColor} />
        <View style={styles.info}>
          <Text style={styles.name}>{servicio.nameService}</Text>
          <Text>Estado: <Text style={styles.estado}>{servicio.estado}</Text></Text>
          <Text style={styles.maintenance}>Próximo mantenimiento: {servicio.nextMaintenance}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#999" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#efefef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 2,
  },
  estado: {
    color: '#2e7d32',
    fontWeight: '500',
    fontSize: 13,
  },
  maintenance: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});