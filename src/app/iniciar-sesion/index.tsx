import Screen from "@/components/ui/Screen"
import { useRouter, Stack } from "expo-router"
import { Text } from "react-native"
import { TextInput, Button, Card, Checkbox } from "react-native-paper"
import { StyleSheet, Image, View } from "react-native";
import perfil from "assets/img/usuario-perfil.jpg";
import {  useState } from "react"
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/supabase/supabase";
import { useAuth } from "@/hooks/useAuth";

export default function IniciarSesion() {
    const router = useRouter();
    const styles = StyleSheet.create({
        fondo: {
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
        imagen: {
            width: 80,
            height: 80,
            borderRadius: 50,
            marginTop: 20,
            marginBottom: 20,
            alignSelf: "center"
        },
        guardar: {
            flexDirection: "row",
            marginLeft: 20,
        },
        guardarOlvidar: {
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
            marginRight: 20
        },
        olvidar: {
            fontStyle: "italic"
        },
        button: {
            marginTop: 15,
            backgroundColor: "#D2AFFD",
            width: "100%",
            maxWidth: 1350,
            color: "black"
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
        }
    })
    const { signIn, loading, error, session} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [guardar, setGuardar] = useState(false);
    const iniciar = async () => {
        try {
            console.log("Intentando iniciar sesión");
            await signIn({ email, password })           
            router.replace("/(tabs)")
            
        } catch (e: any){
            alert("Correo o contraseña incorrecta");
        }
    }
    return (
        <View style={{ flex: 1 }}> 
            <LinearGradient colors={["#3f7ae8", "#6422b4"]} style={styles.fondo}>
                <View style={styles.centrar}>
                    <Card style={styles.card}>
                        <Image style={styles.imagen} source={perfil} />
                        <TextInput style={styles.inputs} onChangeText={(valor: string) => setEmail(valor)}
                            value={email} placeholder="Ingrese correo electronico"></TextInput>
                        <TextInput style={styles.inputs} onChangeText={(valor: string) => setPassword(valor)}
                            value={password} secureTextEntry placeholder="Ingrese contraseña"></TextInput>
                        <View style={styles.guardarOlvidar}>
                            <View style={styles.guardar}>
                                <Checkbox status={guardar ? "checked" : "unchecked"} onPress={() => { setGuardar(!guardar) }} />
                                <Text>Guardar sesion</Text>
                            </View>
                            <Text style={styles.olvidar}>¿Olvidaste la contraseña?</Text>
                        </View>
                    </Card>
                    <Button style={styles.button} labelStyle={styles.textoBoton} onPress={iniciar}
                        loading={loading} disabled={loading}>Iniciar Sesion</Button>
                </View>
            </LinearGradient>
        </View>
    )
}