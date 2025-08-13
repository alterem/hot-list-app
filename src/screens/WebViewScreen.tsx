import React, { useLayoutEffect, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet, Share, TouchableOpacity, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../types';

type WebViewScreenRouteProp = RouteProp<RootStackParamList, 'WebView'>;
type WebViewScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WebView'>;

export default function WebViewScreen() {
  const route = useRoute<WebViewScreenRouteProp>();
  const navigation = useNavigation<WebViewScreenNavigationProp>();
  const { url, title } = route.params;

  const onShare = useCallback(async () => {
    try {
      await Share.share({
        message: Platform.OS === 'ios' ? title : `${title}\n${url}`,
        url: Platform.OS === 'ios' ? url : undefined,
        title: title,
      });
    } catch (error: any) {
      Toast.show({
        type: 'info',
        text1: '分享已取消',
        position: 'top',
        visibilityTime: 2000,
      });
    }
  }, [url, title]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: title || 'Loading...',
      headerRight: () => (
        <TouchableOpacity onPress={onShare} style={{ marginRight: 15 }}>
          <Ionicons name="share-outline" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, title, onShare]);

  return (
    <WebView
      source={{ uri: url }}
      startInLoadingState={true}
      decelerationRate="normal"
      injectedJavaScript={`
        const style = document.createElement('style');
        style.innerHTML = 'body { -webkit-text-size-adjust: 80% !important; }';
        document.head.appendChild(style);
        true;
      `}
      renderLoading={() => (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#34C759" />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
