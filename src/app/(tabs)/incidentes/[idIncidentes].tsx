import React, { useEffect } from 'react';
import Screen from '@/components/ui/Screen';
import { StyleSheet, Text, ScrollView, Alert,  View, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useState } from 'react';
import { TextInput, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import perfil from "assets/img/Admin.jpg";

export default function IncidentesScreen() {
    const [reporte, setReporte] = useState<any>(null);
    useEffect(()=>{
        const cargar = async()=>{
            const guardado = await AsyncStorage.getItem("Nuevo_incidente");
            if (guardado){
                setReporte(JSON.parse(guardado));
            }
        };
        cargar();
    },[]);
    if (!reporte) {
        return <Text>Cargando...</Text>;
    }
    const router = useRouter();
    const styles = StyleSheet.create({
        texto:{
            fontWeight: "bold",
            marginTop: 5,
            marginBottom:5  
        },
        boton:{
            marginTop: 10,
            marginBottom:10,
            borderRadius: 15,
            backgroundColor: "pink"
        },
        estadoTitulo:{
            fontWeight: "bold",
            marginTop: 5,
            marginBottom:5,
            marginLeft: 100
        },
        estadoSubtitulo:{
            
            marginTop: 5,
            marginBottom:5,
            marginLeft: 100
        },
        cardMargen:{
            margin: 20,
            borderRadius:15,
            backgroundColor: "#cbc6c6"
            
        },
        cardTitulo:{
            fontWeight: "bold",
            marginTop: 5
        },
        cardComenterio:{
            
            marginBottom:15
        },
        cardFecha:{
            
            color: "gray",
            marginBottom:5
        },
        imagen:{
            width: 80,
            height: 80,
            borderRadius: 50,
            marginLeft: 10,   
            marginTop: 10

        },
        textoCompleto:{
            flex:1,
            paddingHorizontal: 15
        },
        direccion:{
            flexDirection:"row",
            alignItems:"center"
        }
    });
    
    return(
    <Screen>
        <Stack.Screen options={{title:"Nuevo Incidente", headerTitleAlign:"center",}}/>
            <ScrollView>
                <Text style={styles.texto}>{reporte.titulo} - Piso 3</Text>
                    <Text>Servicio: {reporte.servicio}</Text>
                    <Text>Fecha del reporte: {reporte.fecha}</Text>
                <Text style={styles.texto}>Descripcion</Text>
                    <Text>{reporte.descripcion}</Text>
                <Text style={styles.texto}>Estado actual</Text>

                <Text style={styles.estadoTitulo}>Reportado</Text>
                <Text style={styles.estadoSubtitulo}>{reporte.fecha}</Text>
                <Text style={styles.estadoTitulo}>En proceso</Text>
                <Text style={styles.estadoSubtitulo}>Pendiente</Text>
                <Text style={styles.estadoTitulo}>Resuelto</Text>
                <Text style={styles.estadoSubtitulo}>Pendiente</Text>
                <Text style={styles.texto}>Comentarios</Text>
                <Card style={styles.cardMargen}>
                    <View style={styles.direccion}>
                    <Image style={styles.imagen} source={perfil}/>
                    <View style={styles.textoCompleto}>
                    <Text style={styles.cardTitulo}>Administrador</Text>
                    <Text style={styles.cardFecha}>27/04/2026 14:15hs</Text>
                    <Text style={styles.cardComenterio}>Le informaremos cuando tengamos novedades</Text>
                    </View>
                    </View>
                    
                </Card>
                <Button style={styles.boton}>Agregar comentario</Button>
    </ScrollView>
    </Screen>
);
}