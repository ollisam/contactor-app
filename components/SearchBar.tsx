import {StyleSheet, Text, TextInput, View} from 'react-native'
import React from "react";
import Octicons from "@expo/vector-icons/Octicons";

interface Props {
    placeholder: string;
    onPress: () => void;
}

const SearchBar = ({ placeholder, onPress }: Props) => {
    return (
        <View
            className="w-full h-7 bg-grey-200 rounded-full flex-row items-center">
            <Octicons name="search" size={15} color="#5D5C5C" className="px-3"/>
            <TextInput
                onPress={onPress}
                placeholder={placeholder}
                value=""
                onChangeText={() => {}}
                placeholderTextColor="#5D5C5C"
                className="flex-1 text-sm text-primary font-worksans"
                style={{
                    paddingVertical: 0,
                    lineHeight: 14,
                }}
            />
        </View>
    );
};

export default SearchBar;
const styles = StyleSheet.create({})