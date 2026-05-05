import { View, Text, FlatList } from 'react-native';
import React, {useState} from "react";
import {useRouter} from "expo-router";
import ServiceCard from "@/components/services/ServicesCard";

const [services, setServices] = useState([ 
    { id: 1, icon:'water',  nameService: 'Agua', estado: 'Normal', nextMaintenance: '10/06/2024', iconColor: '#4A90D9'},
    { id: 2, icon:'bulb',   nameService: 'Luz', estado: 'Normal', nextMaintenance: '15/06/2024', iconColor: '#F5A623' },
    { id: 3, icon:'flame',  nameService: 'Gas', estado: 'Normal', nextMaintenance: '20/06/2024', iconColor: '#E84A2E'},
    { id: 4, icon:'wifi',   nameService: 'Internet', estado: 'Normal', nextMaintenance: '10/06/2024', iconColor: '#4A90D9'}
]);

const router = useRouter();

function ServiciosScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
       <Text style={{ fontSize: 13, color: '#999', marginBottom: 16 }}>Estado de servicios del edificio</Text>
      <FlatList data={services} renderItem={({ item }) => (
                  <ServiceCard servicio={item} onPress={() => router.push(`/servicios/${item.id}`)} />
                  )}
              />
    </View>
  );
}

export default ServiciosScreen;