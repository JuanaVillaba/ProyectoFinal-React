import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Screen from '@/components/ui/Screen';
import BrandHeader from '@/components/ui/BrandHeader';
//import logo from '../../assets/logo.png';


export default function Home() {
  return (
    <Screen>
      <BrandHeader
        title="Residencial"
        subtitle="Bienvenido, 3B 👋"
        //logo={logo}
      />

      <View style={styles.section}>
        <Text style={styles.title}>Accesos rápidos</Text>

        <View style={styles.grid}>
          <Text>🛠 Reportar</Text>
          <Text>📢 Avisos</Text>
          <Text>📅 Reservas</Text>
          <Text>👥 Visitas</Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});