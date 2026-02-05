import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import { NewsArticle } from '../types/news';
import { ShareButton } from './ShareButton';
import { BookmarkButton } from './BookmarkButton';
import { getGradientForCoin } from '../services/unsplash';

const { width, height } = Dimensions.get('window');

function timeAgo(dateString: string): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();

  if (isNaN(date)) return '';
  if (date > now) return 'just now';

  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;

  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

interface NewsCardProps {
  article: NewsArticle;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export function NewsCard({ article, isBookmarked, onToggleBookmark }: NewsCardProps) {
  const gradientColors = getGradientForCoin(article.coins[0] || 'crypto');
  const hasImage = article.imageUrl !== null && article.imageUrl !== undefined && article.imageUrl !== '';

  const handleHeadlinePress = async () => {
    if (article.url) {
      await WebBrowser.openBrowserAsync(article.url);
    }
  };

  return (
    <View style={styles.container}>
      {hasImage ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: article.imageUrl! }}
            style={styles.image}
            resizeMode="cover"
            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
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
        <TouchableOpacity onPress={handleHeadlinePress} activeOpacity={1}>
          <Text style={styles.headline} numberOfLines={3}>
            {article.title}
          </Text>
        </TouchableOpacity>
        <Text style={styles.summary}>{article.description}</Text>
        <Text style={styles.source}>{article.source} · {timeAgo(article.publishedAt)}</Text>
      </View>

      {isBookmarked !== undefined && onToggleBookmark && (
        <BookmarkButton
          article={article}
          isBookmarked={isBookmarked}
          onToggle={onToggleBookmark}
        />
      )}
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
    opacity: 1,
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
    minHeight: 100, // Ensure consistent card layout
  },
  source: {
    marginTop: 'auto',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    paddingBottom: 100, // Increased to accommodate bottom nav
  },
});