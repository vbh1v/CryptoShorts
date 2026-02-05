# CryptoShorts MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a TikTok-style React Native app that displays crypto news in a vertical snap-scroll feed.

**Architecture:** Expo app with a single FlatList screen using `pagingEnabled` for snap scrolling. CoinGecko provides news data, Unsplash provides fallback images. Dark theme with full-screen cards.

**Tech Stack:** Expo SDK 52, Expo Router, TypeScript, react-native-reanimated, expo-sharing

---

### Task 1: Initialize Expo Project

**Files:**
- Create: Project scaffold via `create-expo-app`

**Step 1: Create Expo project with TypeScript**

```bash
npx create-expo-app@latest . --template blank-typescript
```

**Step 2: Verify project created**

Run: `ls -la`
Expected: See `app.json`, `package.json`, `tsconfig.json`, `App.tsx`

**Step 3: Install dependencies**

```bash
npx expo install expo-router expo-sharing expo-linking expo-constants expo-status-bar react-native-reanimated react-native-gesture-handler react-native-safe-area-context react-native-screens
```

**Step 4: Verify dependencies installed**

Run: `cat package.json | grep expo-router`
Expected: See `"expo-router"` in dependencies

**Step 5: Commit**

```bash
git add -A
git commit -m "chore: initialize Expo project with TypeScript and dependencies"
```

---

### Task 2: Configure Expo Router

**Files:**
- Modify: `app.json`
- Modify: `package.json`
- Delete: `App.tsx`
- Create: `app/_layout.tsx`
- Create: `app/index.tsx`

**Step 1: Update app.json for Expo Router**

Replace `app.json` with:

```json
{
  "expo": {
    "name": "CryptoShorts",
    "slug": "cryptoshorts",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "scheme": "cryptoshorts",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.cryptoshorts.app"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      },
      "package": "com.cryptoshorts.app"
    },
    "web": {
      "bundler": "metro",
      "favicon": "./assets/favicon.png"
    },
    "plugins": ["expo-router"]
  }
}
```

**Step 2: Update package.json main entry**

Add to `package.json`:

```json
{
  "main": "expo-router/entry"
}
```

**Step 3: Delete App.tsx**

```bash
rm App.tsx
```

**Step 4: Create app directory and layout**

Create `app/_layout.tsx`:

```tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
```

**Step 5: Create placeholder index screen**

Create `app/index.tsx`:

```tsx
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>CryptoShorts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
```

**Step 6: Verify app runs**

Run: `npx expo start`
Expected: App loads showing "CryptoShorts" centered on black background

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: configure Expo Router with dark theme layout"
```

---

### Task 3: Create TypeScript Types

**Files:**
- Create: `types/news.ts`

**Step 1: Create types directory and news types**

Create `types/news.ts`:

```tsx
export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string | null;
  publishedAt: string;
  source: string;
  coins: string[];
}

export interface CoinGeckoNewsResponse {
  data: CoinGeckoNewsItem[];
}

export interface CoinGeckoNewsItem {
  id: string;
  title: string;
  description: string;
  url: string;
  thumb_2x: string | null;
  created_at: number;
  news_site: string;
}
```

**Step 2: Commit**

```bash
git add types/news.ts
git commit -m "feat: add TypeScript types for news data"
```

---

### Task 4: Create CoinGecko Service

**Files:**
- Create: `services/coingecko.ts`

**Step 1: Create services directory and CoinGecko service**

Create `services/coingecko.ts`:

```tsx
import { NewsArticle, CoinGeckoNewsItem } from '../types/news';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

function extractCoins(title: string, description: string): string[] {
  const coinKeywords = [
    'bitcoin', 'btc', 'ethereum', 'eth', 'solana', 'sol',
    'cardano', 'ada', 'ripple', 'xrp', 'dogecoin', 'doge',
    'polkadot', 'dot', 'avalanche', 'avax', 'polygon', 'matic',
    'chainlink', 'link', 'uniswap', 'uni', 'litecoin', 'ltc'
  ];

  const text = `${title} ${description}`.toLowerCase();
  return coinKeywords.filter(coin => text.includes(coin));
}

function truncateToWords(text: string, maxWords: number): string {
  const words = text.split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}

function transformNewsItem(item: CoinGeckoNewsItem): NewsArticle {
  return {
    id: item.id,
    title: item.title,
    description: truncateToWords(item.description || '', 60),
    url: item.url,
    imageUrl: item.thumb_2x || null,
    publishedAt: new Date(item.created_at * 1000).toISOString(),
    source: item.news_site,
    coins: extractCoins(item.title, item.description || ''),
  };
}

export async function fetchNews(): Promise<NewsArticle[]> {
  try {
    const response = await fetch(`${COINGECKO_API}/news`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const items: CoinGeckoNewsItem[] = data.data || [];

    return items.map(transformNewsItem);
  } catch (error) {
    console.error('Failed to fetch news:', error);
    throw error;
  }
}
```

**Step 2: Commit**

```bash
git add services/coingecko.ts
git commit -m "feat: add CoinGecko news service with coin extraction"
```

---

### Task 5: Create Unsplash Fallback Service

**Files:**
- Create: `services/unsplash.ts`

**Step 1: Create Unsplash service**

Create `services/unsplash.ts`:

```tsx
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';

const CRYPTO_GRADIENTS = [
  ['#f7931a', '#ffb347'], // Bitcoin orange
  ['#627eea', '#a8c0ff'], // Ethereum blue
  ['#00ffa3', '#03e1ff'], // Solana gradient
  ['#e84142', '#ff6b6b'], // Avalanche red
  ['#8247e5', '#b490ff'], // Polygon purple
];

export function getGradientForCoin(coinName: string): string[] {
  const coinGradients: Record<string, string[]> = {
    bitcoin: CRYPTO_GRADIENTS[0],
    btc: CRYPTO_GRADIENTS[0],
    ethereum: CRYPTO_GRADIENTS[1],
    eth: CRYPTO_GRADIENTS[1],
    solana: CRYPTO_GRADIENTS[2],
    sol: CRYPTO_GRADIENTS[2],
    avalanche: CRYPTO_GRADIENTS[3],
    avax: CRYPTO_GRADIENTS[3],
    polygon: CRYPTO_GRADIENTS[4],
    matic: CRYPTO_GRADIENTS[4],
  };

  const lowerCoin = coinName.toLowerCase();
  return coinGradients[lowerCoin] || CRYPTO_GRADIENTS[Math.floor(Math.random() * CRYPTO_GRADIENTS.length)];
}

export async function fetchUnsplashImage(query: string): Promise<string | null> {
  // For MVP, we'll use gradient fallbacks instead of Unsplash API
  // to avoid requiring API key setup
  // Uncomment below when ready to integrate Unsplash

  /*
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.results?.[0]?.urls?.regular || null;
  } catch {
    return null;
  }
  */

  return null;
}
```

**Step 2: Commit**

```bash
git add services/unsplash.ts
git commit -m "feat: add Unsplash service with gradient fallbacks"
```

---

### Task 6: Create useNews Hook

**Files:**
- Create: `hooks/useNews.ts`

**Step 1: Create hooks directory and useNews hook**

Create `hooks/useNews.ts`:

```tsx
import { useState, useEffect, useCallback } from 'react';
import { NewsArticle } from '../types/news';
import { fetchNews } from '../services/coingecko';

interface UseNewsResult {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useNews(): UseNewsResult {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const news = await fetchNews();
      setArticles(news);
    } catch (err) {
      setError('Failed to load news. Pull down to retry.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  return {
    articles,
    loading,
    error,
    refresh: loadNews,
  };
}
```

**Step 2: Commit**

```bash
git add hooks/useNews.ts
git commit -m "feat: add useNews hook for data fetching"
```

---

### Task 7: Create ShareButton Component

**Files:**
- Create: `components/ShareButton.tsx`

**Step 1: Create components directory and ShareButton**

Create `components/ShareButton.tsx`:

```tsx
import { TouchableOpacity, StyleSheet, Share, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ShareButtonProps {
  title: string;
  url: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${title}\n\nRead more: ${url}`,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleShare}>
      <Ionicons name="share-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

**Step 2: Install vector icons (if not already included)**

```bash
npx expo install @expo/vector-icons
```

**Step 3: Commit**

```bash
git add components/ShareButton.tsx
git commit -m "feat: add ShareButton component with native share"
```

---

### Task 8: Create NewsCard Component

**Files:**
- Create: `components/NewsCard.tsx`

**Step 1: Create NewsCard component**

Create `components/NewsCard.tsx`:

```tsx
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NewsArticle } from '../types/news';
import { ShareButton } from './ShareButton';
import { getGradientForCoin } from '../services/unsplash';

const { width, height } = Dimensions.get('window');

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const gradientColors = getGradientForCoin(article.coins[0] || 'crypto');
  const hasImage = article.imageUrl !== null;

  return (
    <View style={styles.container}>
      {hasImage ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: article.imageUrl! }}
            style={styles.image}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.imageOverlay}
          />
        </View>
      ) : (
        <LinearGradient
          colors={gradientColors as [string, string]}
          style={styles.gradientContainer}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.coinIcon}>
            {article.coins[0]?.toUpperCase() || '₿'}
          </Text>
        </LinearGradient>
      )}

      <View style={styles.content}>
        <Text style={styles.headline} numberOfLines={3}>
          {article.title}
        </Text>
        <Text style={styles.summary}>{article.description}</Text>
        <Text style={styles.source}>{article.source}</Text>
      </View>

      <ShareButton title={article.title} url={article.url} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: '#000',
  },
  imageContainer: {
    height: height * 0.4,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  gradientContainer: {
    height: height * 0.4,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinIcon: {
    fontSize: 72,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.3)',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 24,
  },
  headline: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    lineHeight: 34,
    marginBottom: 16,
  },
  summary: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 26,
  },
  source: {
    marginTop: 'auto',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    paddingBottom: 60,
  },
});
```

**Step 2: Install expo-linear-gradient**

```bash
npx expo install expo-linear-gradient
```

**Step 3: Commit**

```bash
git add components/NewsCard.tsx
git commit -m "feat: add NewsCard component with image and gradient fallback"
```

---

### Task 9: Create SwipeHint Component

**Files:**
- Create: `components/SwipeHint.tsx`

**Step 1: Create SwipeHint component**

Create `components/SwipeHint.tsx`:

```tsx
import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SwipeHintProps {
  visible: boolean;
}

export function SwipeHint({ visible }: SwipeHintProps) {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -10,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      animation.start();

      const fadeTimeout = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 3000);

      return () => {
        animation.stop();
        clearTimeout(fadeTimeout);
      };
    }
  }, [visible, translateY, opacity]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity, transform: [{ translateY }] }]}>
      <Ionicons name="chevron-up" size={28} color="rgba(255,255,255,0.7)" />
      <Text style={styles.text}>Swipe up for more</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  text: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 4,
  },
});
```

**Step 2: Commit**

```bash
git add components/SwipeHint.tsx
git commit -m "feat: add SwipeHint component with bounce animation"
```

---

### Task 10: Build Main Feed Screen

**Files:**
- Modify: `app/index.tsx`

**Step 1: Update index.tsx with full feed implementation**

Replace `app/index.tsx` with:

```tsx
import { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewsCard } from '../components/NewsCard';
import { SwipeHint } from '../components/SwipeHint';
import { useNews } from '../hooks/useNews';
import { NewsArticle } from '../types/news';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const { articles, loading, error, refresh } = useNews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const insets = useSafeAreaInsets();

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
            refreshing={loading}
            onRefresh={refresh}
            tintColor="#fff"
          />
        }
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
      />
      {currentIndex === 0 && articles.length > 1 && (
        <SwipeHint visible={showHint} />
      )}
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
});
```

**Step 2: Verify app runs with full feed**

Run: `npx expo start`
Expected: App loads news from CoinGecko, displays in swipeable cards

**Step 3: Commit**

```bash
git add app/index.tsx
git commit -m "feat: implement main feed screen with snap scroll"
```

---

### Task 11: Add SafeAreaProvider to Layout

**Files:**
- Modify: `app/_layout.tsx`

**Step 1: Update layout with SafeAreaProvider**

Replace `app/_layout.tsx` with:

```tsx
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </SafeAreaProvider>
  );
}
```

**Step 2: Commit**

```bash
git add app/_layout.tsx
git commit -m "feat: add SafeAreaProvider to root layout"
```

---

### Task 12: Final Testing and Polish

**Files:**
- No new files

**Step 1: Start the app**

```bash
npx expo start
```

**Step 2: Test on iOS Simulator or device**

Verify:
- [ ] News loads on app launch
- [ ] Swipe up/down snaps to next/previous article
- [ ] Images display (or gradient fallback)
- [ ] Share button opens share sheet
- [ ] Swipe hint appears on first article
- [ ] Pull-to-refresh works
- [ ] Error state shows retry button

**Step 3: Final commit**

```bash
git add -A
git commit -m "chore: complete MVP implementation"
```

---

## Summary

After completing all tasks, you'll have:

1. **Expo project** with TypeScript and Expo Router
2. **CoinGecko integration** fetching real crypto news
3. **Full-screen snap scroll** TikTok-style feed
4. **NewsCard component** with image/gradient display
5. **Share functionality** via native share sheet
6. **Error handling** with retry capability
7. **SwipeHint** for first-time users

**To run:** `npx expo start`
