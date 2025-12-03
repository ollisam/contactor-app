import {ScrollView, StyleSheet, Text, View} from 'react-native'
import React from "react";
import Octicons from "@expo/vector-icons/Octicons";

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
                <View className="w-full h-6 bg-white/5 border border-white/10 rounded-full flex-row items-center px-4">
                    <Octicons name="search" size={15} color="#5D5C5C" className="pr-2.5"/>
                    <Text className="text-sm text-secondary font-worksans justify-center">Search</Text>
                </View>

            </ScrollView>
        </View>
    );
};

export default search;
const styles = StyleSheet.create({})