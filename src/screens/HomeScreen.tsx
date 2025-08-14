import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, RootTabParamList } from '../types';
import { formatTimestamp } from '../utils/date';
import { API_BASE_URL } from '../config/api';
import { HotListData, HotListItem, HotListSource } from '../types';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<RootTabParamList, 'Home'>,
  StackNavigationProp<RootStackParamList>
>;

const MODAL_MAX_HEIGHT = Dimensions.get('window').height * 0.7;

// 常量定义
const COLORS = {
  primary: '#34C759',
  background: '#f5f5f5',
  white: '#ffffff',
  text: '#333',
  textSecondary: '#666',
  textLight: '#999',
  border: '#e0e0e0',
  borderLight: '#f0f0f0',
} as const;

const PERFORMANCE_CONFIG = {
  maxToRenderPerBatch: 10,
  windowSize: 10,
  removeClippedSubviews: true,
} as const;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [sources, setSources] = useState<HotListSource[]>([]);
  const [selectedSource, setSelectedSource] = useState<HotListSource | null>(null);
  const [hotListData, setHotListData] = useState<HotListData | null>(null);
  const [loadingSources, setLoadingSources] = useState(true);
  const [loadingList, setLoadingList] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const slideAnim = useRef(new Animated.Value(-MODAL_MAX_HEIGHT)).current;

  useEffect(() => {
    if (categoryModalVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -MODAL_MAX_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [categoryModalVisible, slideAnim]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '热榜加载中...',
    });
    if (hotListData) {
      navigation.setOptions({
        headerTitle: `${hotListData.name} - ${hotListData.title}(${hotListData.type})`
      });
    }
  }, [hotListData, navigation]);

  // 提取错误处理函数
  const showError = useCallback((message: string) => {
    Alert.alert('错误', message);
  }, []);

  const fetchHotList = useCallback(async (path: string) => {
    setLoadingList(true);
    setHotListData(null);
    try {
      const response = await fetch(`${API_BASE_URL}${path}`);
      const data: HotListData = await response.json();
      if (data.code === 200) {
        setHotListData(data);
      } else {
        showError(data.message || '获取热榜数据失败');
      }
    } catch (error) {
      showError('获取热榜数据失败，请检查网络连接');
    } finally {
      setLoadingList(false);
      setRefreshing(false);
    }
  }, [showError]);

  const fetchSources = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/all`);
      const data = await response.json();
      if (data.code === 200 && Array.isArray(data.routes)) {
        const filteredSources = data.routes.filter(
          (route: HotListSource) => !route.path.includes(':')
        );
        setSources(filteredSources);
        if (filteredSources.length > 0) {
          const firstSource = filteredSources[0];
          setSelectedSource(firstSource);
          fetchHotList(firstSource.path);
        }
      } else {
        showError('获取热榜来源格式不正确');
      }
    } catch (error) {
      showError('获取热榜来源失败，请检查网络连接');
    } finally {
      setLoadingSources(false);
    }
  }, [fetchHotList, showError]);

  useEffect(() => {
    fetchSources();
  }, []);

  const onRefresh = useCallback(() => {
    if (selectedSource) {
      setRefreshing(true);
      fetchHotList(selectedSource.path);
    }
  }, [selectedSource, fetchHotList]);

  const handleSourceChange = useCallback((source: HotListSource) => {
    setSelectedSource(source);
    fetchHotList(source.path);
    setCategoryModalVisible(false);
  }, [fetchHotList]);

  const closeImageModal = useCallback(() => {
    setImageModalVisible(false);
    setSelectedImage(null);
  }, []);

  const closeCategoryModal = useCallback(() => {
    setCategoryModalVisible(false);
  }, []);

  const openCategoryModal = useCallback(() => {
    setCategoryModalVisible(true);
  }, []);

  const handleItemPress = useCallback((item: HotListItem) => {
    navigation.navigate('WebView', { url: item.url, title: item.title });
  }, [navigation]);

  const handleImagePress = useCallback((imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageModalVisible(true);
  }, []);

  const renderItem = useCallback((item: HotListItem, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.itemContainer}
      onPress={() => handleItemPress(item)}
    >
      <Text style={styles.itemRank}>{index + 1}</Text>
      {item.cover && (
        <TouchableOpacity onPress={() => item.cover && handleImagePress(item.cover)}>
          <Image source={{ uri: item.cover }} style={styles.thumbnail} />
        </TouchableOpacity>
      )}
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={styles.itemMeta}>
          {item.hot && <Text style={styles.itemHot}>热度: {item.hot}</Text>}
          {item.author && <Text style={styles.itemAuthor}>作者: {item.author}</Text>}
          {item.timestamp && <Text style={styles.itemTime}>{formatTimestamp(item.timestamp)}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  ), [handleItemPress, handleImagePress]);

  if (loadingSources) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34C759" />
        <Text style={styles.loadingText}>加载来源中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={imageModalVisible}
        onRequestClose={closeImageModal}
      >
        <Pressable style={styles.modalContainer} onPress={closeImageModal}>
          {selectedImage && (
            <Image source={{ uri: selectedImage }} style={styles.modalImage} resizeMode="contain" />
          )}
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={closeCategoryModal}
      >
        <Pressable style={styles.categoryModalOverlay} onPress={closeCategoryModal}>
          <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
            <Pressable style={styles.categoryModalContent}>
              <Text style={styles.categoryModalTitle}>选择分类</Text>
              <FlatList
                data={sources}
                keyExtractor={(item) => item.path}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryItem}
                    onPress={() => handleSourceChange(item)}
                  >
                    <Text style={[
                      styles.categoryItemText,
                      selectedSource?.path === item.path && styles.categoryItemTextActive
                    ]}>
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
                numColumns={3}
              />
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      <View style={styles.typeSelectorContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.typeScrollContent}
        >
          {sources.map((source) => (
            <TouchableOpacity
              key={source.path}
              style={[
                styles.typeButton,
                selectedSource?.path === source.path && styles.typeButtonActive,
              ]}
              onPress={() => handleSourceChange(source)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  selectedSource?.path === source.path && styles.typeButtonTextActive,
                ]}
              >
                {source.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={openCategoryModal} style={styles.moreButton}>
          <Ionicons name="chevron-down" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {loadingList && !refreshing ? (
        <View style={styles.listLoadingContainer}>
          <ActivityIndicator size="large" color="#34C759" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      ) : (
        hotListData && hotListData.data ? (
          <FlatList
            data={hotListData.data}
            renderItem={({ item, index }) => renderItem(item, index)}
            keyExtractor={(item, index) => `${item.url}-${index}`}
            style={styles.listContainer}
            contentContainerStyle={styles.card}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
            {...PERFORMANCE_CONFIG}
          />
        ) : (
          <View style={styles.listLoadingContainer}>
            <Text style={styles.loadingText}>暂无数据</Text>
          </View>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  listLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  typeSelectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  typeScrollContent: {
    paddingVertical: 10,
    paddingLeft: 15,
    alignItems: 'center',
  },
  moreButton: {
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  typeButton: {
    backgroundColor: COLORS.borderLight,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  typeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  typeButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: COLORS.white,
  },
  listContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.white,
    margin: 15,
    borderRadius: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  itemRank: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    width: 30,
  },
  itemContent: {
    flex: 1,
    marginLeft: 10,
  },
  itemTitle: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 4,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  itemHot: {
    fontSize: 12,
    color: COLORS.textLight,
    marginRight: 10,
  },
  itemAuthor: {
    fontSize: 12,
    color: COLORS.textLight,
    marginRight: 10,
  },
  itemTime: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginLeft: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalImage: {
    width: '90%',
    height: '90%',
  },
  categoryModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  categoryModalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    maxHeight: MODAL_MAX_HEIGHT,
  },
  categoryModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: COLORS.text,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 5,
    backgroundColor: COLORS.borderLight,
    borderRadius: 8,
  },
  categoryItemText: {
    fontSize: 14,
    color: COLORS.text,
  },
  categoryItemTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});