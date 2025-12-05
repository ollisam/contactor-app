import React, { useEffect, useState } from "react";
import { View, TextInput, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useContacts } from "@/app/hooks/useContacts";
import Octicons from "@expo/vector-icons/Octicons";
import { File, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as Crypto from "expo-crypto";

const EditContact = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { contacts, reloadContacts, permissionStatus } = useContacts();

// Ensure contacts are loaded on this screen
    useEffect(() => {
        if (permissionStatus === "granted" && contacts.length === 0) {
            reloadContacts();
        }
    }, [permissionStatus, contacts.length, reloadContacts]);

    const contact = contacts.find((c) => String(c.id) === String(id));

    // Local state for form fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [avatar, setAvatar] = useState("");

    // When contact is loaded, prefill the state
    useEffect(() => {
        if (!contact) return;

        setFirstName((contact as any).firstName ?? "");
        setLastName((contact as any).lastName ?? "");
        setPhone(
            (contact as any).phone
            ?? (Array.isArray(contact.phoneNumbers) ? contact.phoneNumbers[0]?.number : "")
            ?? ""
        );
        setAvatar((contact as any).avatar ?? "");
    }, [contact]);

    if (!contact) {
        return (
            <View className="flex-1 bg-background items-center justify-center">
                <Text className="text-primary font-worksans text-lg">Contact not found.</Text>
            </View>
        );
    }

    const handleSave = () => {
        if (!contact || !contact.isCustom) return;

        const fullName = `${firstName} ${lastName}`.trim() || "Unnamed";

        // Extract the existing filename and UUID from contact.id
        const currentFileName = String(contact.id);
        const uuid = Crypto.randomUUID();

        // Build a new safe name based on the updated full name
        const safeName = fullName
            .replace(/[^a-z0-9\- ]/gi, "")
            .replace(/\s+/g, "-");

        const newFileName = `${safeName}-${uuid}.json`;

        // Delete the old file
        try {
            const oldFile = new File(Paths.document, currentFileName);
            oldFile.delete();
        } catch (e) {
            console.warn("Failed to delete old contact file", e);
        }

        // Write the new file with updated content
        const file = new File(Paths.document, newFileName);

        const content = {
            name: fullName,
            phoneNumber: phone,
            photo: avatar,
        };

        file.write(JSON.stringify(content));

        router.push('/');
    };

    const handlePickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                console.warn("Permission to access media library was denied");
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setAvatar(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Error picking image:", error);
        }
    };

    return (
        <View className="flex-1 bg-background px-6 pt-20">
            <ScrollView>
                {/* header */}
                <View className="flex-row items-center justify-between mt-5 mb-2.5">
                    <TouchableOpacity
                        className="w-10 h-10 rounded-full bg-grey-200 items-center justify-center mb-2"
                        onPress={() => {
                            router.back()
                        }}
                    >
                        <Octicons name="x" size={20} color="white" />
                    </TouchableOpacity>
                    <Text className="text-primary text-lg font-worksans">Edit contact</Text>
                    <TouchableOpacity
                        className="w-10 h-10 rounded-full bg-grey-200 items-center justify-center mb-2"
                        onPress={() => {
                            handleSave();
                        }}
                    >
                        <Octicons name="check" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                {/* avatar */}
                <View className="flex-row items-center justify-center mt-7 mb-2">
                    <View className="w-32 h-32 rounded-full bg-grey-200 items-center justify-center mb-2 overflow-hidden">
                        {avatar ? (
                            <Image
                                source={{ uri: avatar }}
                                style={{ width: "100%", height: "100%" }}
                                resizeMode="cover"
                            />
                        ) : null}
                    </View>
                </View>

                <TouchableOpacity
                    className="self-center bg-grey-100 px-10 py-3 rounded-full mb-8"
                    onPress={handlePickImage}
                >
                    <Text className="text-white text-lg font-worksans">Change photo</Text>
                </TouchableOpacity>

                {/* first + last name */}
                <View className="bg-grey-200 rounded-3xl p-4 mb-6">
                    <View className="bg-grey-100 rounded-2xl mb-3">
                        <TextInput
                            placeholder="First name"
                            placeholderTextColor="#ffffff"
                            className="text-white text-lg font-worksans h-14 px-5"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                    </View>

                    <View className="bg-grey-100 rounded-2xl">
                        <TextInput
                            placeholder="Last name"
                            placeholderTextColor="#ffffff"
                            className="text-white text-lg font-worksans h-14 px-5"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                    </View>
                </View>

                {/* phone */}
                <View className="bg-grey-200 rounded-3xl p-4">
                    <View className="bg-grey-100 rounded-2xl">
                        <TextInput
                            placeholder="Phone number"
                            placeholderTextColor="#ffffff"
                            keyboardType="phone-pad"
                            className="text-white text-lg font-worksans h-14 px-5"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default EditContact;