import React from 'react';
import Screen from '@/components/ui/Screen';
import { View, StyleSheet, Text, ScrollView, Alert, Image } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { Card, TextInput, Button } from 'react-native-paper';
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker"
import AsyncStorage from '@react-native-async-storage/async-storage';

type eleccion= "Agua"|"Electricidad"|"Gas"|"Internet";
export default function NewIncidentesScreen() {
    
    const guardarReporte= async()=>{
        const horario= new Date();
        const fechaHorario = `${horario.toLocaleDateString()} ${horario.toLocaleTimeString()}`;
        try{
            const nuevo ={
                id:Date.now().toString(),
                servicio: seleccionado,
                titulo: tituloTexto,
                descripcion: descripcionTexto,
                imagen: imagen,
                fecha: fechaHorario
            };
            await AsyncStorage.setItem("Nuevo_incidente",JSON.stringify(nuevo));
            Alert.alert("Se a guardado tu reporte")
            router.push("/incidentes/[idIncidentes]");
        }
            catch(error){
                Alert.alert("ERROR: " + error)
            }
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
        }
    });
    const [seleccionado, setSeleccionado]= useState<eleccion>("Agua");
    const [tituloTexto, setTituloTexto]= useState<string>("");
    const [descripcionTexto, setDescripcionTexto]= useState<string>("");
    const [imagen, setImagen] = useState <string | null>(null);

     const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Lo siento', 'Necesitamos permisos para ver tus fotos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], 
      allowsEditing: true,    
      aspect: [4, 3],         
      quality: 1,           
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri); // Guardamos la ruta de la foto
    }
  };

    return(
    <Screen>
        <Stack.Screen options={{title:"Nuevo Incidente", headerTitleAlign:"center",}}/>
            <ScrollView>
                <Text style={styles.texto}>Servicio</Text>
                <Picker
                    selectedValue={seleccionado}
                    onValueChange={(itemValue: eleccion)=> setSeleccionado(itemValue)}
                >
                    <Picker.Item label="Agua" value="Agua"/>
                    <Picker.Item label="Electricidad" value="Electricidad"/>
                    <Picker.Item label="Gas" value="Gas"/>
                    <Picker.Item label="Internet" value="Internet"/>
                </Picker>
                <Text style={styles.texto}>Titulo</Text>
                <TextInput
                    value ={tituloTexto}
                    onChangeText={(valor: string)=> setTituloTexto(valor)}
                    placeholder="Ingrese titulo"
                />
                <Text style={styles.texto}>Descripcion</Text>
                <TextInput
                    value ={descripcionTexto}
                    onChangeText={(valor: string)=> setDescripcionTexto(valor)}
                    placeholder="Ingrese descripcion"
                />
                <Text style={styles.texto}>Fotos (opcional)</Text>
                <Button style={styles.boton} onPress={pickImage}>Seleccionar imagen</Button>
                {imagen && <Image source={{ uri: imagen }}/>}
                <Button style={styles.boton} onPress={guardarReporte}>Enviar</Button>
            </ScrollView>
    </Screen>
);
}