import { useState, useEffect, useCallback } from 'react';
import { NewsArticle } from '../types/news';
import { fetchNews } from '../services/coingecko';

export function useNews() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadNews = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
        setPage(1);
      } else if (page === 1) {
        setLoading(true);
      }
      
      setError(null);
      console.log(`Fetching news page ${isRefresh ? 1 : page}...`);
      const news = await fetchNews(isRefresh ? 1 : page);
      console.log(`Loaded ${news.length} news articles`);
      
      if (news.length === 0) {
        setHasMore(false);
      } else {
        if (isRefresh) {
          setArticles(news);
          setPage(2);
          setHasMore(true);
        } else {
          setArticles(prev => page === 1 ? news : [...prev, ...news]);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load news';
      console.error('Error loading news:', err);
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const refresh = useCallback(async () => {
    await loadNews(true);
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    await loadNews(false);
    setPage(prev => prev + 1);
  }, [page, loadingMore, hasMore]);

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