import Screen from "@/components/ui/Screen";
import { useRouter, Stack } from "expo-router";
import { Text } from "react-native";
import { TextInput, Button, Card, Checkbox } from "react-native-paper";
import { StyleSheet, Image, View } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
//import { usuario } from "@/supabase/supabase";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";


export default function RegistrarUsuarioScreen() {
    const router = useRouter();
    const styles = StyleSheet.create({
        fondo: {
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
        textoBoton: {
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

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [terminos, setTerminos]= useState(false);
        const { signUp, loading, error} = useAuth();     
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const options = {
        data: { 
            nombre:nombre,
            apellido: apellido }
            };
        const registrar = async () =>{
                await signUp({email, password, options})
            }
    return (
        <Screen>
            <Stack.Screen options={{ headerTitleAlign: "center" }} />
            <LinearGradient colors={["#3f7ae8", "#6422b4"]} style={styles.fondo}>
                <View style={styles.centrar}>
                    <Card style={styles.card}>
                        <Text style={styles.titulo}>Iniciar sesion</Text>
                        <TextInput style={styles.inputs} value={nombre}
                            onChangeText={(valor: string) => setNombre(valor)}
                            placeholder="Ingrese nombre"/>
                            <TextInput style={styles.inputs} value={apellido}
                            onChangeText={(valor: string) => setApellido(valor)}
                            placeholder="Ingrese nombre"/>
                        <TextInput style={styles.inputs} value={email}
                            onChangeText={(valor: string) => setEmail(valor)}
                            keyboardType="email-address"
                            placeholder="Ingrese correo electronico"/>
                        <TextInput style={styles.inputs} value={password}
                            onChangeText={(valor: string) => setPassword(valor)}
                            secureTextEntry placeholder="Ingrese contraseña"/>
                        <View style={styles.aceptar}>
                            <Checkbox status={terminos ? "checked":"unchecked"} onPress={()=>{ setTerminos(!terminos)}}/>
                            <Text style={styles.texto}>Acepta los terminos y condiciones</Text>
                        </View>
                        
                    </Card>
                    <Button style={styles.button} labelStyle={styles.textoBoton} onPress={registrar}>Registrar</Button>
                </View>
            </LinearGradient>

        </Screen>
    )
}