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
    const response = await fetch(`${COINGECKO_API}/news?page=1`);

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
