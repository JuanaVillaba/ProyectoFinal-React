import Screen from "@/components/ui/Screen"
import { useRouter, Stack } from "expo-router"
import { Text } from "react-native"
import { TextInput, Button, Card } from "react-native-paper"
import { StyleSheet, Image, View } from "react-native";
import perfil from "assets/img/usuario-perfil.jpg";
import { ChangeEvent } from "react"

export default function IniciarSesion() {
    const router = useRouter();
    const styles = StyleSheet.create({
        card: {
            backgroundColor: "#EBDBFE",
        },
        inputs: {
            width: 300,
            alignSelf: "center",
            backgroundColor: "white",
            marginBottom: 15
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
            backgroundColor: "#D2AFFD"
        },
        centrar:{
            flexDirection: "column",
            alignContent: "center",
            justifyContent: "center",
        }
    })
    return (
        <Screen>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.centrar}>
                <Card style={styles.card}>
                    <Image style={styles.imagen} source={perfil} />
                    <TextInput style={styles.inputs} placeholder="Ingrese corro electronico"></TextInput>
                    <TextInput style={styles.inputs} placeholder="Ingrese contraseña"></TextInput>
                    <View style={styles.guardarOlvidar}>
                        <View style={styles.guardar}>
                            <input type="checkbox" id="" />
                            <Text>Guardar sesion</Text>
                        </View>
                        <Text style={styles.olvidar}>¿Olvidaste la contraseña?</Text>
                    </View>
                </Card>
                <Button style={styles.button} onPress={() => router.push("/(tabs)")}>Iniciar Sesion</Button>
            </View>
        </Screen>
    )
}