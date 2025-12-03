import { Stack } from "expo-router";
import './globals.css';
import {useFonts, InstrumentSerif_400Regular} from "@expo-google-fonts/instrument-serif";

export default function RootLayout() {
    const[fontLoaded] = useFonts({
        InstrumentSerif_400Regular,
    });

    return (
    <Stack>
        <Stack.Screen
            name="(tabs)"
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="contacts/[id]"
            options={{
                headerShown: false,
            }}
        />
    </Stack>
)};
