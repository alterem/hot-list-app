import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';

import HomeScreen from './src/screens/HomeScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import HelpScreen from './src/screens/HelpScreen';
import AboutScreen from './src/screens/AboutScreen';
import { RootStackParamList, RootTabParamList } from './src/types';

const Tab = createBottomTabNavigator<RootTabParamList>();
const Stack = createStackNavigator<RootStackParamList>();

const headerTheme = {
  headerStyle: {
    backgroundColor: '#34C759',
    height: 85,
  },
  headerTintColor: 'white',
  headerTitleStyle: {
    fontWeight: 'bold' as 'bold',
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...headerTheme,
        tabBarActiveTintColor: '#34C759',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 65,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '首页',
          headerTitle: '热榜',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '我的',
          headerTitle: '个人中心',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          screenOptions={headerTheme}
        >
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="WebView"
            component={WebViewScreen}
            options={{
              headerBackTitle: '返回',
            }}
          />
          <Stack.Screen
            name="Help"
            component={HelpScreen}
            options={{
              title: '帮助中心',
              headerBackTitle: '返回',
            }}
          />
          <Stack.Screen
            name="About"
            component={AboutScreen}
            options={{
              title: '关于',
              headerBackTitle: '返回',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
}