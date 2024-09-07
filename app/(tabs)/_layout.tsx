import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tabIconSelected,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Community',
          tabBarIcon: ({ color, focused }) => (
<<<<<<< HEAD
            <TabBarIcon name='ChatsCircle' color={color} />
=======
            <TabBarIcon
              name={focused ? 'home' : 'home-outline'}
              color={color}
            />
>>>>>>> main
          ),
        }}
      />

      <Tabs.Screen
<<<<<<< HEAD
        name='calendar'
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name='CalendarPlus' color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name='explore'
=======
        name='discover'
>>>>>>> main
        options={{
          title: 'Discover',
          tabBarIcon: ({ color, focused }) => (
<<<<<<< HEAD
            <TabBarIcon name='Compass' color={color} />
=======
            <TabBarIcon
              name={focused ? 'code-slash' : 'code-slash-outline'}
              color={color}
            />
>>>>>>> main
          ),
        }}
      />
    </Tabs>
  );
}
