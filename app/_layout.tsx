import {SplashScreen, Stack, Tabs} from "expo-router";
import './globals.css';
import {useFonts, InstrumentSerif_400Regular} from "@expo-google-fonts/instrument-serif";
import {WorkSans_400Regular} from "@expo-google-fonts/work-sans";
import React, {useEffect} from "react";

export default function RootLayout() {

    const [fontsLoaded, fontError] = useFonts({
        InstrumentSerif_400Regular,
        WorkSans_400Regular
    })

    useEffect(() => {
        if (fontError) throw fontError;
    }, [fontError]);

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    // Block rendering until fonts are ready.
    if (!fontsLoaded) {
        return null;
    }

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
        <Tabs.Screen
            name="contacts/edit_contact"
            options={{
                headerShown: false,
            }}
        />
    </Stack>
)};
