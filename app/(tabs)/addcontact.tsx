import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import React, {useState} from "react";
import Octicons from "@expo/vector-icons/Octicons";
import {router} from "expo-router";
import { File, Paths } from "expo-file-system"

const contactsFile = new File(Paths.document, "contacts.json");

const addContact = () => {

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [phone, setPhone] = React.useState("");

    const handleSave = () => {
        const newContact = { firstName, lastName, phone };

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
                    <View className="w-32 h-32 rounded-full bg-grey-200 items-center justify-center mb-2"></View>
                </View>
                {/* Add Photo Button */}
                <TouchableOpacity className="self-center bg-grey-100 px-10 py-3 rounded-full mb-8">
                    <Text className="text-white text-lg font-worksans">Add Photo</Text>
                </TouchableOpacity>

                {/* Name Card */}
                <View className="bg-grey-200 rounded-3xl p-4 mb-6">
                    <View className="bg-grey-100 rounded-2xl px-5 py-3 mb-3">
                        <TextInput
                            placeholder="First name"
                            placeholderTextColor="#ffffff"
                            className="text-white text-lg font-worksans"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </View>

                    <View className="bg-grey-100 rounded-2xl px-5 py-3">
                        <TextInput
                            placeholder="Last name"
                            placeholderTextColor="#ffffff"
                            className="text-white text-lg font-worksans"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </View>
                </View>

                {/* Phone Card */}
                <View className="bg-grey-200 rounded-3xl p-4">
                    <View className="bg-grey-100 rounded-2xl px-5 py-3">
                        <TextInput
                            placeholder="Phone number"
                            placeholderTextColor="#ffffff"
                            keyboardType="phone-pad"
                            className="text-white text-lg font-worksans"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>
                </View>

            </ScrollView>
        </View>
    );
};

export default addContact;
const styles = StyleSheet.create({})