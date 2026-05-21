import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import MapScreen from '../screens/MapScreen';
import RidesScreen from '../screens/Rides';
import ProfileScreen from '../screens/Profile';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

type IoniconName = ComponentProps<typeof Ionicons>['name'];

const ICONS: Record<
  keyof MainTabParamList,
  { focused: IoniconName; default: IoniconName }
> = {
  Início: { focused: 'map', default: 'map-outline' },
  Caronas: { focused: 'car', default: 'car-outline' },
  Perfil: { focused: 'person', default: 'person-outline' },
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icon = ICONS[route.name] || { default: 'help' };
          const iconName = focused ? icon.focused : icon.default;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0047AB',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Início" component={MapScreen} />
      <Tab.Screen name="Caronas" component={RidesScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}