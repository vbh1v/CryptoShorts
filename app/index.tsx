import { useState, useCallback, useEffect } from 'react';
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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewsCard } from '../components/NewsCard';
import { SwipeHint } from '../components/SwipeHint';
import { BottomNav } from '../components/BottomNav';
import { useNews } from '../hooks/useNews';
import { NewsArticle } from '../types/news';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const { articles, loading, refreshing, loadingMore, error, hasMore, refresh, loadMore } = useNews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const insets = useSafeAreaInsets();

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
        setCurrentIndex(viewableItems[0].index);
        if (viewableItems[0].index > 0) {
          setShowHint(false);
        }
      }
    },
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: NewsArticle }) => <NewsCard article={item} />,
    []
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
        data={articles}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#fff"
            colors={['#fff']} // Android
            progressBackgroundColor="#333" // Android
          />
        }
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
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        // Web-specific props
        style={Platform.OS === 'web' ? styles.webList : undefined}
      />
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