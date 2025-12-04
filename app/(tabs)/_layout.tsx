import {StyleSheet, Text, View} from 'react-native'
import { BlurView } from 'expo-blur';
import React from "react";
import { Tabs } from "expo-router";
import Octicons from '@expo/vector-icons/Octicons';

const TabIcon = ({focused, icon}: any) => {
    return (
        <View
            className={`flex flex-row w-full flex-1 min-w-[103px] min-h-[44px] mt-4 items-center justify-center rounded-full overflow-hidden ${focused ? "bg-white/10 border border-white/20" : ""}`}
        >
            <Octicons
                name={icon}
                size={28}
                color={focused ? "#7A15FF" : "#FFFFFF"}
            />
        </View>
    )
}

const _layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center'
                },
                tabBarStyle: {
                    marginHorizontal: 20,
                    marginBottom: 36,
                    borderRadius: 50,
                    height: 52,
                    position: 'absolute',
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.07)',
                    elevation: 0,
                    shadowColor: '#000',
                    shadowOpacity: 0.25,
                    shadowRadius: 20,
                    shadowOffset: { width: 0, height: 10 },
                    overflow: 'hidden',
                },
                tabBarBackground: () => (
                    <BlurView
                        intensity={50}
                        tint="dark"
                        style={StyleSheet.absoluteFillObject}
                    />
                ),
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon="person"
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon="search"
                        />
                    )
                }}
            />
            <Tabs.Screen
                name="add_contact"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            focused={focused}
                            icon="plus"
                        />
                    )
                }}
            />
        </Tabs>
    );
};

export default _layout;
const styles = StyleSheet.create({})