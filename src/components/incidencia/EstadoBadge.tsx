import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  estado: 'pendiente' | 'en_proceso' | 'resuelto';
};

export default function EstadoBadge({ estado }: Props) {
  const getColor = () => {
    switch (estado) {
      case 'pendiente':
        return '#f59e0b';
      case 'en_proceso':
        return '#3b82f6';
      case 'resuelto':
        return '#10b981';
    }
  };

  return (
    <View style={[styles.badge, { backgroundColor: getColor() }]}>
      <Text style={styles.text}>{estado.replace('_', ' ')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    textTransform: 'capitalize',
  },
});