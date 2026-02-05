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
  const hasImage = article.imageUrl !== null && article.imageUrl !== undefined && article.imageUrl !== '';

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
  },
  source: {
    marginTop: 'auto',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    paddingBottom: 60,
  },
});