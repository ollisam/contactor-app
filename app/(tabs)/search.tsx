import {ScrollView, StyleSheet, Text, View} from 'react-native'
import React from "react";
import SearchBar from "@/components/SearchBar";

const search = () => {
    return (
        <View className="flex-1 bg-background px-6 pt-20">
            {/* Header row */}
            <ScrollView className="flex-1 px-1" showsVerticalScrollIndicator={false} contentContainerStyle={{minHeight: "100%", paddingBottom: 10}}>
                <View className="flex-row items-center justify-between mt-16 mb-2.5">
                    <Text className="text-6xl text-primary font-bold font-instrument" style={{ lineHeight: 55}}>
                        Recents
                    </Text>
                </View>

                {/* Search bar */}
                <View className="flex-1">
                    <SearchBar
                        onPress={() => {}}
                        placeholder="Search"
                    />
                </View>

            </ScrollView>
        </View>
    );
};

export default search;
const styles = StyleSheet.create({})