import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import HomeTab from './tabs/HomeTab';
import BookingsTab from './tabs/BookingsTab';
import ServicesTab from './tabs/ServicesTab';
import ProfileTab from './tabs/ProfileTab';
import { colors } from '../../theme';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? '🏠' : '🏠';
          } else if (route.name === 'Bookings') {
            iconName = focused ? '📅' : '📅';
          } else if (route.name === 'Services') {
            iconName = focused ? '✂️' : '✂️';
          } else if (route.name === 'Profile') {
            iconName = focused ? '👤' : '👤';
          }

          return <Text style={{ fontSize: size, color }}>{iconName}</Text>;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeTab}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Bookings" 
        component={BookingsTab}
        options={{
          tabBarLabel: 'Bookings',
        }}
      />
      <Tab.Screen 
        name="Services" 
        component={ServicesTab}
        options={{
          tabBarLabel: 'Services',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileTab}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
