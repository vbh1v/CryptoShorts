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
