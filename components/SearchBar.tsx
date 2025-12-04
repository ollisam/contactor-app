import {StyleSheet, TextInput, View} from 'react-native'
import React from "react";
import Octicons from "@expo/vector-icons/Octicons";

interface Props {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    // onPressIcon?: () => void;
}

const SearchBar = ({ placeholder, onChangeText, value }: Props) => {
    return (
        <View
            className="w-full h-7 bg-grey-200 rounded-full flex-row items-center">
            <Octicons name="search" size={15} color="#5D5C5C" className="px-3"/>
            <TextInput
                className="flex-1 text-sm text-primary font-worksans"
                placeholder={placeholder}
                placeholderTextColor="#5D5C5C"
                value={value}
                onChangeText={onChangeText}
                autoCorrect={false}
                autoCapitalize="none"
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