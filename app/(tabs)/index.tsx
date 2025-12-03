import {ActivityIndicator, SectionList, ScrollView, Text, TouchableOpacity, View, Image} from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from "expo-router";
import SearchBar from "@/components/SearchBar";
import { useEffect } from "react";
import { useContacts } from "../hooks/useContacts";
import type { Contact } from "../types/contacts";

function groupContacts(contacts: Contact[]) {
    // 1. Sort alphabetically
    const sorted = [...contacts].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    // 2. Group by first letter
    const groups: Record<string, Contact[]> = {};

    for (const contact of sorted) {
        const firstLetter = contact.name.charAt(0).toUpperCase();

        if (!groups[firstLetter]) {
            groups[firstLetter] = [];
        }
        groups[firstLetter].push(contact);
    }

    // 3. Convert to SectionList format
    return Object.keys(groups)
        .sort()
        .map((letter) => ({
            title: letter,
            data: groups[letter],
        }));
}

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
        return (
            <View className="flex-row items-center py-3 px-2">
                {item.avatar ? (
                    <Image
                        source={{ uri: item.avatar }}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                ) : (
                    <View className="w-10 h-10 rounded-full bg-grey-200 mr-3" />
                )}

                <Text className="text-base font-semibold font-worksans text-primary">
                    {item.name}
                </Text>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-background px-6 pt-20">
            <SectionList
                sections={groupContacts(contacts)}
                keyExtractor={(item) => item.id}
                renderItem={renderContactItem}
                renderSectionHeader={({ section }) => (
                    <View className="bg-background px-2 pt-4 border-b border-grey-200">
                        <Text className="text-primary font-worksans font-semibold text-xs mb-1">
                            {section.title}
                        </Text>
                        <View className="h-px bg-grey-800 w-full" />
                    </View>
                )}
                ListHeaderComponent={
                    <ScrollView>
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
                            <View>
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
