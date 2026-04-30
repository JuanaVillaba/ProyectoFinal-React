import Screen from "@/components/ui/Screen"
import { useRouter, Stack } from "expo-router"
import { Text } from "react-native"
import { TextInput, Button } from "react-native-paper"
export default function IniciarSesion(){
    const router= useRouter();
    return (
        <Screen>
            <Stack.Screen options={{title:"Iniciar Sesion", headerTitleAlign: "center"}}/>
            <Text>Ingrese correo electronico: </Text>
            <TextInput placeholder="Ingrese corro electronico"></TextInput>
            <Text>Ingrese contraseña: </Text>
            <TextInput placeholder="Ingrese contraseña"></TextInput>
            <Button onPress={() => router.push("/(tabs)")}>Iniciar Sesion</Button>
        </Screen>
    )
}