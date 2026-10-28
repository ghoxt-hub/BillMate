import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import BillsScreen from '../screens/BillsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import MoreScreen from '../screens/MoreScreen';
import AddBillScreen from '../screens/AddBillScreen';

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ onPress }: any) => (
  <TouchableOpacity style={styles.customButtonWrapper} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.customButton}>
      {/* We are hardcoding the icon here to stop the text warning */}
      <MaterialCommunityIcons name="plus" size={28} color={COLORS.surface} />
    </View>
  </TouchableOpacity>
);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 10, fontFamily: 'Poppins_500Medium', marginTop: -4 },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: any;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Bills') iconName = focused ? 'file-document' : 'file-document-outline';
          else if (route.name === 'Add') iconName = 'plus';
          else if (route.name === 'Calendar') iconName = focused ? 'calendar' : 'calendar-blank-outline';
          else if (route.name === 'More') iconName = 'dots-horizontal-circle-outline';

          if (route.name === 'Add') {
            return <MaterialCommunityIcons name={iconName} size={28} color={COLORS.surface} />;
          }
          return <MaterialCommunityIcons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bills" component={BillsScreen} />
      <Tab.Screen 
        name="Add" 
        component={AddBillScreen} 
        options={{
          tabBarLabel: () => null, // <---ADD THIS LINE
          tabBarButton: (props) => <CustomTabBarButton {...props} />
        }}
      />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="More" component={MoreScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    elevation: 4,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    height: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    paddingBottom: 10,
    borderTopWidth: 0,
  },
  customButtonWrapper: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
});