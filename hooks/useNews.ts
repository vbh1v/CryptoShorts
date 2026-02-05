import { useState, useEffect, useCallback, useRef } from 'react';
import { NewsArticle } from '../types/news';
import { fetchNews } from '../services/coingecko';
import { fetchMessariNews } from '../services/messari';

export function useNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);
  const loadingMoreRef = useRef(false);

  const loadNews = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);
      pageRef.current = 1;
      setHasMore(true);
      console.log('Fetching news from CoinGecko and Messari...');

      const results = await Promise.allSettled([
        fetchNews(1),
        fetchMessariNews(),
      ]);

      const coingeckoArticles = results[0].status === 'fulfilled' ? results[0].value : [];
      const messariArticles = results[1].status === 'fulfilled' ? results[1].value : [];

      if (results[0].status === 'rejected') {
        console.warn('CoinGecko fetch failed:', results[0].reason);
      }
      if (results[1].status === 'rejected') {
        console.warn('Messari fetch failed:', results[1].reason);
      }

      // Merge: CoinGecko first, then Messari (deduplicated by title similarity)
      const merged = [...coingeckoArticles];
      const existingTitles = new Set(
        coingeckoArticles.map(a => a.title.toLowerCase().trim())
      );
      for (const article of messariArticles) {
        if (!existingTitles.has(article.title.toLowerCase().trim())) {
          merged.push(article);
        }
      }

      console.log(
        `Loaded ${coingeckoArticles.length} CoinGecko + ${messariArticles.length} Messari articles (${merged.length} after dedup)`
      );
      setArticles(merged);
      if (merged.length === 0) {
        setHasMore(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load news';
      console.error('Error loading news:', err);
      setError(message);
      setHasMore(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refresh = useCallback(async () => {
    await loadNews(true);
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMoreRef.current || !hasMore) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const nextPage = pageRef.current + 1;
      console.log(`Loading more news, page ${nextPage}...`);
      const newArticles = await fetchNews(nextPage);
      if (newArticles.length === 0) {
        setHasMore(false);
      } else {
        pageRef.current = nextPage;
        setArticles(prev => {
          const existingIds = new Set(prev.map(a => a.id));
          const unique = newArticles.filter(a => !existingIds.has(a.id));
          if (unique.length === 0) {
            setHasMore(false);
            return prev;
          }
          return [...prev, ...unique];
        });
      }
    } catch (err) {
      console.error('Error loading more news:', err);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }, [hasMore]);

  useEffect(() => {
    loadNews();
  }, []);

  return {
    articles,
    loading,
    refreshing,
    loadingMore,
    error,
    hasMore,
    refresh,
    loadMore,
  };
}
