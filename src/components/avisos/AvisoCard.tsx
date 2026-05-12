import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type Categoria = 'general' | 'importante';

export interface Aviso {
  id: string;
  titulo: string;
  fechaEvento: string;
  descripcion: string;
  fechaPublicacion: string;
  categoria: Categoria;
  icono: string;
}

export default function AvisoCard({ aviso }: { aviso: Aviso }) {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>{aviso.icono}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.titulo}>{aviso.titulo}</Text>
          {aviso.categoria === 'importante' && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Importante</Text>
            </View>
          )}
        </View>
        <Text style={styles.fechaEvento}>{aviso.fechaEvento}</Text>
        <Text style={styles.descripcion}>{aviso.descripcion}</Text>
        <Text style={styles.fechaPub}>{aviso.fechaPublicacion}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
  },
  badge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '500',
  },
  fechaEvento: {
    fontSize: 13,
    color: '#555',
  },
  descripcion: {
    fontSize: 13,
    color: '#555',
    lineHeight: 18,
  },
  fechaPub: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});