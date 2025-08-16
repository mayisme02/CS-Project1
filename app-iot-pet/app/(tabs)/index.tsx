import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';

export default function index() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'หน้าหลัก',
          tabBarIcon: ({ color }) => <FontAwesome6 name="house" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="pet"
        options={{
          title: 'สัตว์เลี้ยง',
          tabBarIcon: ({ color }) => <FontAwesome6 name="paw" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'แผนที่',
          tabBarIcon: ({ color }) => <FontAwesome6 name="map-pin" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="devices"
        options={{
          title: 'อุปกรณ์',
          tabBarIcon: ({ color }) => <MaterialIcons name="devices" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'โปรไฟล์',
          tabBarIcon: ({ color }) => <FontAwesome6 name="user-pen" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}