import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { NewsCard } from '../components/NewsCard';
import { SwipeHint } from '../components/SwipeHint';
import { BottomNav } from '../components/BottomNav';
import { useNews } from '../hooks/useNews';
import { useBookmarks } from '../hooks/useBookmarks';
import { NewsArticle } from '../types/news';

export default function HomeScreen() {
  const { articles, loading, refreshing, loadingMore, error, hasMore, refresh, loadMore } = useNews();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const insets = useSafeAreaInsets();

  const { height: windowHeight } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);
  const currentIndexRef = useRef(0);
  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  // Add web-specific CSS for snap scrolling
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        /* Hide scrollbar */
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        const idx = viewableItems[0].index;
        if (idx !== currentIndexRef.current) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        currentIndexRef.current = idx;
        setCurrentIndex(idx);
        if (idx > 0) {
          setShowHint(false);
        }
      }
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: NewsArticle }) => (
      <NewsCard
        article={item}
        isBookmarked={isBookmarked(item.id)}
        onToggleBookmark={() => toggleBookmark(item)}
      />
    ),
    [isBookmarked, toggleBookmark]
  );

  const keyExtractor = useCallback((item: NewsArticle) => item.id, []);

  if (loading && articles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading news...</Text>
      </View>
    );
  }

  if (error && articles.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refresh}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={articles}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        pagingEnabled={Platform.OS !== 'web'}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#fff"
            colors={['#fff']}
            progressBackgroundColor="#333"
          />
        }
        getItemLayout={(_, index) => ({
          length: windowHeight,
          offset: windowHeight * index,
          index,
        })}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingMore}>
              <ActivityIndicator color="#fff" />
              <Text style={styles.loadingMoreText}>Loading more news...</Text>
            </View>
          ) : null
        }
        style={Platform.OS === 'web' ? styles.webList : undefined}
      />
      <TouchableOpacity
        style={styles.savedButton}
        onPress={() => router.push('/saved')}
      >
        <Ionicons name="bookmarks-outline" size={22} color="#fff" />
      </TouchableOpacity>
      {currentIndex === 0 && articles.length > 1 && (
        <SwipeHint visible={showHint} />
      )}
      <BottomNav
        activeTab="home"
        onTabPress={(tab) => {
          // Navigation will be added later
          console.log('Tab pressed:', tab);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  savedButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webList: {
    scrollSnapType: 'y mandatory',
    overflowY: 'scroll',
    overscrollBehavior: 'contain',
  } as any,
  loadingMore: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  loadingMoreText: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 8,
    fontSize: 14,
  },
});
