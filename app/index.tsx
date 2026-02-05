import { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Platform,
  NativeSyntheticEvent,
  NativeScrollEvent,
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

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const { articles, loading, refreshing, loadingMore, error, hasMore, refresh, loadMore } = useNews();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const insets = useSafeAreaInsets();

  const flatListRef = useRef<FlatList>(null);
  const currentIndexRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const isScrollingRef = useRef(false);

  const onScrollBeginDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      dragStartOffsetRef.current = e.nativeEvent.contentOffset.y;
    },
    []
  );

  const onScrollEndDrag = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (Platform.OS === 'web') return; // Web uses CSS snap scrolling
      const offsetY = e.nativeEvent.contentOffset.y;
      const diff = offsetY - dragStartOffsetRef.current;
      const threshold = 10; // minimum pixels to register as a swipe

      let nextIndex = currentIndexRef.current;
      if (diff > threshold) {
        nextIndex = Math.min(currentIndexRef.current + 1, articles.length - 1);
      } else if (diff < -threshold) {
        nextIndex = Math.max(currentIndexRef.current - 1, 0);
      }

      isScrollingRef.current = true;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });

      if (nextIndex !== currentIndexRef.current) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);
      if (nextIndex > 0) {
        setShowHint(false);
      }

      // Reset scrolling flag after animation completes
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 300);
    },
    [articles.length]
  );

  const onMomentumScrollBegin = useCallback(() => {
    // On native, we handle scrolling ourselves via onScrollEndDrag.
    // Cancel any momentum so the list doesn't overshoot.
    if (Platform.OS !== 'web' && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: currentIndexRef.current,
        animated: true,
      });
    }
  }, []);

  // Add web-specific CSS for snap scrolling
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        /* Hide scrollbar */
        ::-webkit-scrollbar {
          display: none;
        }

        /* Snap scrolling for web */
        div[data-testid="flat-list"] {
          scroll-snap-type: y mandatory !important;
          overflow-y: scroll !important;
          -webkit-overflow-scrolling: touch !important;
        }

        div[data-testid="flat-list"] > div {
          scroll-snap-align: start !important;
        }

        /* Ensure full height items */
        div[data-testid="flat-list"] > div > div {
          height: 100vh !important;
          scroll-snap-align: start !important;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
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
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollBegin={onMomentumScrollBegin}
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
          length: height,
          offset: height * index,
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
        // Web-specific props
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
  },
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
