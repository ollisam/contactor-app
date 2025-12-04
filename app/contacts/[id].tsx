import {Image, StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native'
import React, {useEffect} from "react";
import {router, useFocusEffect, useLocalSearchParams} from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useContacts} from "@/app/hooks/useContacts";
import * as Linking from "expo-linking";
import { useRecents } from "@/app/hooks/useRecents";


const contactDetail = () => {

    const { id } = useLocalSearchParams()


    const {
        contacts,
        reloadContacts,
        permissionStatus,
        isLoading,
    } = useContacts();

    const { logCall } = useRecents();

    // Ensure contacts are loaded on this screen too
    useEffect(() => {
        if (permissionStatus === "granted" && contacts.length === 0) {
            reloadContacts();
        }
    }, [permissionStatus, contacts.length, reloadContacts]);
    useFocusEffect(
        React.useCallback(() => {
            if (permissionStatus === "granted") {
                reloadContacts();
            }
        }, [permissionStatus])
    );

    const contact = contacts.find((c) => String(c.id) === String(id));

    if (!id) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <Text className="text-primary font-worksans text-lg">
                    No contact id provided.
                </Text>
            </View>
        );
    }

    if (isLoading && contacts.length === 0) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <Text className="text-primary font-worksans text-lg">
                    Loading contact…
                </Text>
            </View>
        );
    }
    if (!contact) {
        return (
            <View className="flex-1 bg-background px-6 pt-20">
                <View className="flex-row items-center justify-between mb-6">
                    <TouchableOpacity
                        className="w-10 h-10 rounded-full bg-grey-200 items-center justify-center"
                        onPress={() => router.back()}
                    >
                        <MaterialIcons name="arrow-back-ios-new" size={20} color="white" />
                    </TouchableOpacity>

                </View>
                <View className="flex-1 items-center justify-center">
                    <Text className="text-primary font-worksans text-lg">
                        Contact not found.
                    </Text>
                </View>
            </View>
        );
    }

    const handleCall = async () => {
        if (!contact || !contact.phoneNumbers) return;

        const phoneNumber = contact.phoneNumbers;

        try {
            await Linking.openURL(`tel:${phoneNumber}`);
        } finally {
            // Log the call regardless of whether user actually completes it in dialer
            await logCall({
                id: contact.id,
                name: contact.name,
                phoneNumbers: phoneNumber,
                avatar: contact.avatar ?? null,
                timestamp: Date.now(),
            });
        }
    };

    return (
        <View className="flex-1 bg-background px-6 pt-20">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header row */}
                <View className="flex-row items-center justify-between mb-6">
                    <TouchableOpacity
                        className="w-10 h-10 rounded-full bg-grey-200 items-center justify-center"
                        onPress={() => router.back()}
                    >
                        <MaterialIcons name="arrow-back-ios-new" size={20} color="white" />
                    </TouchableOpacity>

                    {contact.isCustom && (
                        <TouchableOpacity
                            className="px-4 py-2 bg-grey-200 rounded-full"
                            onPress={() =>
                                router.push({
                                    pathname: "./edit_contact",
                                    params: { id: String(contact.id) }
                                })
                            }
                        >
                            <Text className="text-white text-base font-worksans">Edit</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Avatar */}
                <View className="items-center justify-center mt-4 mb-6">
                    <View className="w-32 h-32 rounded-full bg-grey-200 overflow-hidden">
                        {contact.avatar ? (
                            <Image
                                source={{ uri: contact.avatar }}
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="cover"
                            />
                        ) : null}
                    </View>
                </View>

                {/* Name */}
                <Text className="text-white text-3xl font-worksans text-center mb-4">
                    {contact.name}
                </Text>
                    {contact.phoneNumbers && (
                        <TouchableOpacity onPress={handleCall}>
                            <Text className="text-accent text-lg text-center font-worksans">
                                {contact.phoneNumbers}
                            </Text>
                        </TouchableOpacity>
                    )}

                <View style={{ height: 50 }} />
            </ScrollView>
        </View>
    );
}

export default contactDetail;
const styles = StyleSheet.create({})