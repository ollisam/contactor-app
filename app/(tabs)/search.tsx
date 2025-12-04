import {StyleSheet, Text, View, Image, FlatList, TouchableOpacity} from 'react-native'
import React, {useMemo, useCallback} from "react";
import SearchBar from "@/components/SearchBar";
import { useContacts } from "../hooks/useContacts";
import { useRecents } from "../hooks/useRecents";
import type { RecentCall } from "../types/recents";
import {useSearchQuery} from "@/app/hooks/useSearchQuery";
import * as Linking from "expo-linking";
import {FontAwesome} from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

type RecentRow = RecentCall & {
    contactName: string;
    avatar: string | null;
};

const search = () => {
    const { contacts } = useContacts();
    const { recentCalls, reloadRecents, clearAllRecents } = useRecents();
    const { query, setQuery, normalizedQuery } = useSearchQuery();

    useFocusEffect(
        useCallback(() => {
            reloadRecents();
        }, [reloadRecents])
    );

    const rows: RecentRow[] = useMemo(
        () =>
            recentCalls.map((call) => {
                const contact = contacts.find((c) => c.id === call.id);

                return {
                    ...call,
                    // Always fall back to something string-y
                    contactName:
                        call.name ??
                        contact?.name ??
                        call.phoneNumbers ??
                        "",
                    avatar: contact?.avatar ?? null,
                };
            }),
        [recentCalls, contacts]
    );

    const filteredRows: RecentRow[] = useMemo(
        () => {
            if (!normalizedQuery) return rows;

            return rows.filter((row) => {
                const q = normalizedQuery.toLowerCase();
                const name = (row.contactName ?? "").toLowerCase();
                const phone = (row.phoneNumbers ?? "").toLowerCase();

                return name.includes(q) || phone.includes(q);
            });
        },
        [rows, normalizedQuery]
    );

    const renderItem = ({ item }: { item: RecentRow }) => {
        const time = new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        const handleCallPress = () => {
            if (item.phoneNumbers) {
                Linking.openURL(`tel:${item.phoneNumbers}`);
            }
        };

        return (
            <View className="flex-row items-center py-3 px-2">
                {/* Avatar – identical styling to Contacts */}
                {item.avatar ? (
                    <Image
                        source={{ uri: item.avatar }}
                        className="w-10 h-10 rounded-full mr-3"
                    />
                ) : (
                    <View className="w-10 h-10 rounded-full bg-grey-200 mr-3" />
                )}

                {/* Name – identical styling to Contacts */}
                <View className="flex-1">
                    <Text className="text-base font-semibold font-worksans text-primary">
                        {item.contactName}
                    </Text>
                </View>

                {/* Time + call icon on the right */}
                <Text className="text-sm text-secondary font-worksans mr-4">
                    {time}
                </Text>

                <TouchableOpacity
                    onPress={handleCallPress}
                    className="w-9 h-9 rounded-full bg-grey-200 items-center justify-center"
                    activeOpacity={0.8}
                >
                    <FontAwesome name="phone" size={18} color="#7A15FF" />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View className="flex-1 bg-background px-6 pt-20">
            {/* Header row */}
                <View className="flex-row items-center justify-between mt-16 mb-3">
                    <Text className="text-6xl text-primary font-bold font-instrument" style={{ lineHeight: 55}}>
                        Recents
                    </Text>
                    <TouchableOpacity className="px-4 py-2 bg-grey-200 rounded-full" onPress={clearAllRecents}>
                        <Text className="text-white text-base font-worksans">Clear</Text>
                    </TouchableOpacity>
                </View>

                {/* Search bar */}
                <View className="w-full">
                    <SearchBar
                        value={query}
                        onChangeText={setQuery}
                        placeholder="Search"
                    />
                </View>

                <FlatList
                    data={filteredRows}
                    keyExtractor={(item, index) => `${item.id}-${item.timestamp}-${index}`}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 32 }}
                />
        </View>
    );
};

export default search;
const styles = StyleSheet.create({})