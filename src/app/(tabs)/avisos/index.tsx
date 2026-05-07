import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import AvisoCard, {Aviso} from '@/components/avisos/AvisoCard';

type Tab = 'todos' | 'generales' | 'importantes';

const tabs: { key: Tab; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'generales', label: 'Generales' },
  { key: 'importantes', label: 'Importantes' },
];

const AVISOS: Aviso[] = [
  {
    id: '1',
    titulo: 'Corte de agua programado',
    fechaEvento: 'Viernes 24 de mayo · 9:00 a 14:00 hs',
    descripcion: 'Se realizará un corte de agua general por mantenimiento.',
    fechaPublicacion: '20/05/2024',
    categoria: 'importante',
    icono: '📢',
  },
  {
    id: '2',
    titulo: 'Mantenimiento de ascensores',
    fechaEvento: 'Sábado 25 de mayo · 8:00 a 12:00 hs',
    descripcion: 'Los ascensores estarán fuera de servicio durante la mañana.',
    fechaPublicacion: '19/05/2024',
    categoria: 'general',
    icono: '🗓',
  },
  {
    id: '3',
    titulo: 'Recordatorio: pago de expensas',
    fechaEvento: 'Vence el 10 de junio',
    descripcion: 'Recordamos que el vencimiento de las expensas es el día 10 de junio.',
    fechaPublicacion: '18/05/2024',
    categoria: 'general',
    icono: 'ℹ️',
  },
];

export default function AvisosScreen() {
  const [tabActiva, setTabActiva] = useState<Tab>('todos');

  const avisosFiltrados = AVISOS.filter((a) => {
    if (tabActiva === 'generales') return a.categoria === 'general';
    if (tabActiva === 'importantes') return a.categoria === 'importante';
    return true;
  });

  return (
    <View style={styles.container}>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setTabActiva(tab.key)}
            style={[
              styles.tab,
              tabActiva === tab.key && styles.tabActiva,
            ]}
          >
            <Text style={[
              styles.tabText,
              tabActiva === tab.key && styles.tabTextActiva,
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista de avisos */}
      <FlatList
        data={avisosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AvisoCard aviso={item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay avisos en esta categoría</Text>
          </View>
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: '#EFEFEF',
  },
  tabActiva: {
    backgroundColor: '#3B82F6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
  },
  tabTextActiva: {
    color: '#fff',
    fontWeight: '600',
  },
  empty: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});