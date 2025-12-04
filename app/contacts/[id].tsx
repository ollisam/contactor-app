import {Image, StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native'
import React, {useEffect} from "react";
import {router, useFocusEffect, useLocalSearchParams} from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useContacts} from "@/app/hooks/useContacts";
import * as Linking from "expo-linking";
import { useRecents } from "@/app/hooks/useRecents";
import {FontAwesome} from "@expo/vector-icons";


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
                <View className="flex-row items-center justify-between mb-8">
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
                                    params: { id: String(contact.id) },
                                })
                            }
                        >
                            <Text className="text-white text-base font-worksans">Edit</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Avatar + name */}
                <View className="items-center mb-8">
                    <View className="w-32 h-32 rounded-full bg-grey-200 overflow-hidden mb-4">
                        {contact.avatar ? (
                            <Image
                                source={{ uri: contact.avatar }}
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="cover"
                            />
                        ) : null}
                    </View>

                    <Text className="text-white text-3xl font-worksans text-center">
                        {contact.name}
                    </Text>
                </View>

                {/* Phone section */}
                {contact.phoneNumbers && (
                    <View className="mt-2">
                        {/* Tapable row with number + call icon */}
                        <TouchableOpacity
                            onPress={handleCall}
                            activeOpacity={0.85}
                            className="flex-row items-center justify-between bg-grey-900 rounded-2xl px-4 py-3"
                        >
                            <View className="flex-1 mr-3">
                                <Text className="text-xs text-secondary font-worksans uppercase tracking-wide mb-1">
                                    Mobile
                                </Text>
                                <Text className="text-lg text-primary font-worksans">
                                    {contact.phoneNumbers}
                                </Text>
                            </View>

                            <View className="w-10 h-10 rounded-full bg-grey-100 items-center justify-center">
                                <FontAwesome name="phone" size={20} color="#7A15FF" />
                            </View>
                        </TouchableOpacity>

                    </View>
                )}

                <View style={{ height: 80 }} />
            </ScrollView>
        </View>
    );
}

export default contactDetail;
const styles = StyleSheet.create({})