import Screen from "@/components/ui/Screen";
import { useRouter, Stack } from "expo-router";
import { Text } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { StyleSheet, Image, View } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function RegistrarUsuarioScreen() {
    const router = useRouter();
    const styles = StyleSheet.create({
        fondo:{
            backgroundColor: "#F3E8FF",
            flex: 1
        },
        card: {
            backgroundColor: "#EBDBFE",
            width: "100%",
            maxWidth: 1350,
        },
        inputs: {
            width: 300,
            alignSelf: "center",
            backgroundColor: "white",
            marginBottom: 15,
            marginLeft: 20,
            marginRight: 20,
            borderColor: "#6422b4",
            borderRadius: 15,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            borderWidth: 2,
        },
        button: {
            marginTop: 15,
            backgroundColor: "#D2AFFD"
        },
        textoBoton:{
            color: "#6422b4",
            fontWeight: "bold"
        },
        centrar: {
            flex: 1,
            flexDirection: "column",
            alignSelf: "center",
            justifyContent: "center",
        },
        titulo: {
            fontWeight: "bold",
            fontSize: 30,
            textAlign: "center",
            marginTop: 20,
            marginBottom: 20,
            color: "#2D3748"
        },
        aceptar: {
            flexDirection: "row",
            alignSelf: "center",
            marginBottom: 15
        },
        texto: {
            fontSize: 19
        }
    });

    const [nombreIngresado, setNombreIngresado] = useState<string>("");
    const [correoIngresado, setCorreoIngresado] = useState<string>("");
    const [contraseñaIngresada, setContraseñaIngresada] = useState<string>("");
    const [direcionIngresada, setDirecionIngresada] = useState<string>("");
    const [pisoIngresado, setPisoIngresado] = useState<string>("");
    const [letraOnumeroIngresado, setLetraOnumeroIngresado] = useState<string>("");
    const registrar = {
        nombre: nombreIngresado,
        correo: correoIngresado,
        contraseña: contraseñaIngresada,
        direccion: direcionIngresada,
        piso: pisoIngresado,
        letraOnumero: letraOnumeroIngresado
    };
    return (
        <Screen>
            <Stack.Screen options={{ headerTitleAlign: "center" }} />
            <LinearGradient colors={["#3f7ae8", "#6422b4"]} style={styles.fondo}>
                <View style={styles.centrar}>
                <Card style={styles.card}>
                    <Text style={styles.titulo}>Iniciar sesion</Text>
                    <TextInput style={styles.inputs} value={nombreIngresado}
                        onChangeText={(valor: string) => setNombreIngresado(valor)}
                        placeholder="Ingrese nombre"
                    ></TextInput>

                    <TextInput style={styles.inputs} value={correoIngresado}
                        onChangeText={(valor: string) => setCorreoIngresado(valor)}
                        placeholder="Ingrese corro electronico"></TextInput>

                    <TextInput style={styles.inputs} value={contraseñaIngresada}
                        onChangeText={(valor: string) => setContraseñaIngresada(valor)}
                        placeholder="Ingrese contraseña"></TextInput>

                    <TextInput style={styles.inputs} value={direcionIngresada}
                        onChangeText={(valor: string) => setDirecionIngresada(valor)}
                        placeholder="Ingrese direccion"></TextInput>

                    <TextInput style={styles.inputs} value={pisoIngresado}
                        onChangeText={(valor: string) => setPisoIngresado(valor)}
                        placeholder="Ingrese piso"></TextInput>

                    <TextInput style={styles.inputs} value={letraOnumeroIngresado}
                        onChangeText={(valor: string) => setLetraOnumeroIngresado(valor)}
                        placeholder="Ingrese letra o numero"></TextInput>
                    <View style={styles.aceptar}>
                        <input type="checkbox" id="" />
                        <Text style={styles.texto}>Acepta los terminos y condiciones</Text>
                    </View>

                </Card>

                <Button style={styles.button} labelStyle={styles.textoBoton} onPress={() => router.push("/(tabs)")}>Registrar</Button>

            </View>
            </LinearGradient>
            
        </Screen>
    )
}