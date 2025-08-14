import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { RootStackParamList, RootTabParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

const GITHUB_URL = 'https://github.com/alterem/hot-list-app';

export default function AboutScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const openGitHub = () => {
    // Linking.openURL(GITHUB_URL).catch(err => console.error("Couldn't load page", err));
    navigation.navigate('WebView', { url: GITHUB_URL, title: '源码' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />
        <Text style={styles.appName}>Hot List App</Text>
        <Text style={styles.appVersion}>Version 1.0.0</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          这是一款汇集了全网热门榜单的应用，旨在帮助您快速获取最新、最热的资讯。
        </Text>
      </View>

      <TouchableOpacity style={styles.menuItem} onPress={openGitHub}>
        <Ionicons name="logo-github" size={24} color="#333" />
        <Text style={styles.menuText}>访问源码</Text>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Copyright © 2025 Alterem</Text>
        <Text style={styles.footerText}>All Rights Reserved.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
    marginBottom: 15,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  appVersion: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '100%',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    width: '100%',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#aaa',
  },
});
