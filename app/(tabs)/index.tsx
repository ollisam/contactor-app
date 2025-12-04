import {ActivityIndicator, SectionList, ScrollView, Text, TouchableOpacity, View, Image} from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import {useFocusEffect, useRouter} from "expo-router";
import SearchBar from "@/components/SearchBar";
import {useCallback, useEffect, useMemo} from "react";
import { useContacts } from "../hooks/useContacts";
import type { Contact } from "../types/contacts";
import { useSearchQuery } from "../hooks/useSearchQuery";
import { contactMatchesQuery } from "../utils/contactSearch";
import { groupContacts } from "../utils/groupContacts";
import {useSafeAreaInsets} from "react-native-safe-area-context";


export default function Index() {
    const router = useRouter();
    const { query, setQuery, normalizedQuery } = useSearchQuery();
    const insets = useSafeAreaInsets();

    const {
        contacts,
        isLoading,
        error,
        permissionStatus,
        requestPermission,
        reloadContacts,
    } = useContacts();

    const filteredContacts = useMemo(
        () => contacts.filter((c) => contactMatchesQuery(c, normalizedQuery)),
        [contacts, normalizedQuery]
    );

    const sections = useMemo(
        () => groupContacts(filteredContacts),
        [filteredContacts]
    );

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

    useFocusEffect(
        useCallback(() => {
            if (permissionStatus === "granted") {
                reloadContacts();   // always refresh when returning to this screen
            }
        }, [permissionStatus, reloadContacts])
    );

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

    const renderSectionHeader = ({ section }: { section: { title: string } }) => (
        <View className="bg-background px-2 pt-4 border-b border-grey-200">
            <Text className="text-primary font-worksans font-semibold text-xs mb-1">
                {section.title}
            </Text>
            <View className="h-px bg-grey-800 w-full" />
        </View>
    );

    return (
        <View className="flex-1 bg-background px-6 pt-20">
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={renderContactItem}
                renderSectionHeader={renderSectionHeader}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: insets.bottom + 70,
                }}
                ListHeaderComponent={
                    <View className="px-1 pb-4">
                        {/* Header row */}
                        <View className="flex-row items-center justify-between mt-16 mb-3">
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
                                value={query}
                                onChangeText={setQuery}
                                placeholder="Search"
                            />
                        </View>

                        {/* Loading state */}
{/*                        {isLoading && (
                            <View className="flex-row items-center gap-x-2 mb-2">
                                <ActivityIndicator />
                                <Text className="text-sm text-grey-300">
                                    Loading contacts...
                                </Text>
                            </View>
                        )}*/}

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
                }
                ListEmptyComponent={null}
            />
        </View>
    );
}
