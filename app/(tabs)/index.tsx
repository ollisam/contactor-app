import {ActivityIndicator, FlatList, ScrollView, Text, TouchableOpacity, View} from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from "expo-router";
import SearchBar from "@/components/SearchBar";
import { useEffect } from "react";
import { useContacts } from "../hooks/useContacts";
import type { Contact } from "../types/contacts";

export default function Index() {
    const router = useRouter();

    const {
        contacts,
        isLoading,
        error,
        permissionStatus,
        requestPermission,
        reloadContacts,
    } = useContacts();

    useEffect(() => {
        // Only run logic when we actually know the status
        if (permissionStatus === "undetermined") {
            // First time: ask for permission, then try to load
            (async () => {
                await requestPermission();
                await reloadContacts();
            })();
        } else if (permissionStatus === "granted" && contacts.length === 0 && !isLoading) {
            // Already granted (e.g. returning user): just load contacts
            (async () => {
                await reloadContacts();
            })();
        }
        // If denied/blocked: do nothing here. UI will show a message.
    }, [permissionStatus, requestPermission, reloadContacts, contacts.length, isLoading]);

    const renderContactItem = ({ item }: { item: Contact }) => {
        const primaryPhone = item.phoneNumbers[0] ?? "No phone number";

        return (
            <View className="py-3 border-b border-grey-200">
                <Text className="text-base font-semibold font-worksans text-primary">
                    {item.name}
                </Text>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-background px-6 pt-20">
            <FlatList
                data={contacts}
                keyExtractor={(item) => item.id}
                renderItem={renderContactItem}
                contentContainerStyle={{ paddingBottom: 24 }}
                ListHeaderComponent={
                    <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
                        <View className="px-1 pb-4 min-h-full">
                            {/* Header row */}
                            <View className="flex-row items-center justify-between mt-16 mb-2.5">
                                <Text
                                    className="text-6xl text-primary font-bold font-instrument"
                                    style={{ lineHeight: 55 }}
                                >
                                    Contacts
                                </Text>
                                <TouchableOpacity
                                    className="w-8 h-8 rounded-full bg-grey-200 items-center justify-center mb-2"
                                    onPress={() => {
                                        router.push("./addcontact");
                                    }}
                                >
                                    <Octicons name="plus" size={20} color="white" />
                                </TouchableOpacity>
                            </View>

                            {/* Search bar */}
                            <View className="mb-4">
                                <SearchBar
                                    onPress={() => router.push("/search")}
                                    placeholder="Search"
                                />
                            </View>

                            {/* Loading state */}
                            {isLoading && (
                                <View className="flex-row items-center gap-x-2 mb-2">
                                    <ActivityIndicator />
                                    <Text className="text-sm text-grey-300">
                                        Loading contacts...
                                    </Text>
                                </View>
                            )}

                            {/* Error message */}
                            {error && (
                                <Text className="text-sm text-red-500 mb-2">
                                    {error}
                                </Text>
                            )}

                            {/* Empty state */}
                            {!isLoading && !error && contacts.length === 0 && (
                                <Text className="text-sm text-grey-400">
                                    No contacts to display yet. Tap &quot;Load Contacts&quot; to
                                    import them from your phone.
                                </Text>
                            )}
                        </View>
                    </ScrollView>
                }
                ListEmptyComponent={null}
            />
        </View>
    );
}
