import {ScrollView, Text, TextInput, TouchableOpacity, View, Image} from 'react-native'
import React, {useCallback} from "react";
import Octicons from "@expo/vector-icons/Octicons";
import {router, useFocusEffect} from "expo-router";
import { File, Paths } from "expo-file-system"
import * as ImagePicker from 'expo-image-picker';
import * as Crypto from "expo-crypto";

const add_contact = () => {

    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [avatar, setAvatar] = React.useState("");

    useFocusEffect(
        useCallback(() => {
            // Screen just became active → ensure fields are cleared
            setFirstName("");
            setLastName("");
            setPhone("");
            setAvatar("");
            return;
        }, [])
    );

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
        try {
            // 1. Build full name
            const name = `${firstName} ${lastName}`.trim() || "Unnamed";

            // 2. Generate UUID
            const uuid = Crypto.randomUUID();

            // 3. Build safe filename <name>-<uuid>.json
            const safeName = name
                .replace(/[^a-z0-9\- ]/gi, "")
                .replace(/\s+/g, "-");
            const fileName = `${safeName}-${uuid}.json`;

            // 4. Prepare payload in rubric format
            const payload = {
                name,
                phoneNumber: phone,
                photo: avatar || null,
            };

            // 5. Write a single JSON object to its own file
            const file = new File(Paths.document, fileName);
            file.write(JSON.stringify(payload));

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
                            style={{ paddingVertical: 0 }}
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

export default add_contact;