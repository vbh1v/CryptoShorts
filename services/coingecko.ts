import { NewsArticle, CoinGeckoNewsItem } from '../types/news';
import { fallbackNews } from './fallback-news';

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
    id: String(item.id),
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
    // Try CoinGecko API first
    const response = await fetch(`${COINGECKO_API}/news?page=1`);

    if (!response.ok) {
      console.warn(`CoinGecko API returned ${response.status}, using fallback data`);
      return fallbackNews;
    }

    const data = await response.json();
    const items: CoinGeckoNewsItem[] = data.data || [];

    // If no data, use fallback
    if (!items || items.length === 0) {
      console.warn('No news items from API, using fallback data');
      return fallbackNews;
    }

    return items.map(transformNewsItem);
  } catch (error) {
    console.error('Failed to fetch news, using fallback:', error);
    // Return fallback news if API fails (CORS, network issues, etc)
    return fallbackNews;
  }
}