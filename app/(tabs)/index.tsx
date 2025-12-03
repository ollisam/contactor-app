import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import Octicons from '@expo/vector-icons/Octicons';
import { useRouter } from "expo-router";
import SearchBar from "@/components/SearchBar";

export default function Index() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-background px-6 pt-20">
            {/* Header row */}
            <ScrollView className="flex-1 px-1" showsVerticalScrollIndicator={false} contentContainerStyle={{minHeight: "100%", paddingBottom: 10}}>
                <View className="flex-row items-center justify-between mt-16 mb-2.5">
                    <Text className="text-6xl text-primary font-bold font-instrument" style={{ lineHeight: 55}}>
                        Contacts
                    </Text>
                    <TouchableOpacity
                        className="w-8 h-8 rounded-full bg-grey-200 items-center justify-center mb-2"
                        onPress={() => {
                            router.push('./addcontact')
                        }}
                    >
                        <Octicons name="plus" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                {/* Search bar */}
                <View className="flex-1">
                    <SearchBar
                        onPress={() => router.push('/search')}
                        placeholder="Search"
                    />
                </View>

            </ScrollView>
        </View>
    );
}
