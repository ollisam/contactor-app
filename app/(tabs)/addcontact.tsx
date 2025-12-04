import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image} from 'react-native'
import React, {useState} from "react";
import Octicons from "@expo/vector-icons/Octicons";
import {router} from "expo-router";
import { File, Paths } from "expo-file-system"
import * as ImagePicker from 'expo-image-picker';

const contactsFile = new File(Paths.document, "contacts.json");

const addContact = () => {

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [avatar, setAvatar] = React.useState("");

    const handlePickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                console.warn('Permission to access media library was denied');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setAvatar(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const handleSave = () => {
        const newContact = { firstName, lastName, phone, avatar };

        try {
            // 1. Ensure we have an existing list
            let contacts: any[] = [];

            if (contactsFile.exists) {
                // 2. Read file contents synchronously
                const data = contactsFile.textSync();
                if (data) {
                    contacts = JSON.parse(data);
                }
            } else {
                // Create the file if it does not exist
                contactsFile.create();
            }

            // 3. Add new contact
            contacts.push(newContact);

            // 4. Write updated list synchronously
            contactsFile.write(JSON.stringify(contacts));

            router.back();
        } catch (err) {
            console.error("Failed to save contact:", err);
        }
    };

    return (
        <View className="flex-1 bg-background px-6 pt-20">
            {/* Header row */}
            <ScrollView className="flex-1 px-1" showsVerticalScrollIndicator={false} contentContainerStyle={{minHeight: "100%", paddingBottom: 10}}>
                <View className="flex-row items-center justify-between mt-5 mb-2.5">
                    <TouchableOpacity
                        className="w-10 h-10 rounded-full bg-grey-200 items-center justify-center mb-2"
                        onPress={() => {
                            router.back()
                        }}
                    >
                        <Octicons name="x" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-primary text-lg font-worksans">New contact</Text>
                    <TouchableOpacity
                        className="w-10 h-10 rounded-full bg-grey-200 items-center justify-center mb-2"
                        onPress={() => {
                            handleSave();
                        }}
                    >
                        <Octicons name="check" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                <View className="flex-row items-center justify-center mt-7 mb-2">
                    <View className="w-32 h-32 rounded-full bg-grey-200 items-center justify-center mb-2 overflow-hidden">
                        {avatar ? (
                            <Image
                                source={{ uri: avatar }}
                                style={{ width: '100%', height: '100%' }}
                                resizeMode="cover"
                            />
                        ) : null}
                    </View>
                </View>
                {/* Add Photo Button */}
                <TouchableOpacity
                    className="self-center bg-grey-100 px-10 py-3 rounded-full mb-8"
                    onPress={handlePickImage}
                >
                    <Text className="text-white text-lg font-worksans">Add Photo</Text>
                </TouchableOpacity>

                {/* Name Card */}
                <View className="bg-grey-200 rounded-3xl p-4 mb-6">
                    <View className="bg-grey-100 rounded-2xl mb-3">
                        <TextInput
                            placeholder="First name"
                            placeholderTextColor="#ffffff"
                            className="text-white text-lg font-worksans h-14 px-5"
                            style={{ paddingVertical: 0 }}   // this fixes the low text on iOS
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </View>

                    <View className=" bg-grey-100 rounded-2xl">
                        <TextInput
                            placeholder="Last name"
                            placeholderTextColor="#ffffff"
                            className="text-white text-lg font-worksans h-14 px-5"
                            value={lastName}
                            onChangeText={setLastName}
                            textAlignVertical="center"
                        />
                    </View>
                </View>

                {/* Phone Card */}
                <View className="bg-grey-200 rounded-3xl p-4">
                    <View className="bg-grey-100 rounded-2xl">
                        <TextInput
                            placeholder="Phone number"
                            placeholderTextColor="#ffffff"
                            keyboardType="phone-pad"
                            className="text-white text-lg font-worksans h-14 px-5"
                            value={phone}
                            onChangeText={setPhone}
                            textAlignVertical="center"
                        />
                    </View>
                </View>

            </ScrollView>
        </View>
    );
};

export default addContact;
const styles = StyleSheet.create({})